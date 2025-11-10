import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import logo1 from 'assets/images/marca_agua/logo-contrato.png';
import logo2 from 'assets/images/marca_agua/logo-empresa.png';

export const BingoCardsPdf = ({ bingoCards, event, user }) => {
  const pdfRef = useRef();

  const generatePDF = async () => {
    const input = pdfRef.current;

    // Make the container visible temporarily for capturing
    input.style.display = 'block';

    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Process cards in batches of 4 (2 rows of 2 cards)
    for (let i = 0; i < bingoCards.length; i += 4) {
      // If not the first page, add a new page
      if (i > 0) {
        pdf.addPage();
      }

      // Get current batch of up to 4 cards
      const currentBatch = bingoCards.slice(i, i + 4);

      // Show only the current batch
      document.querySelectorAll('.bingo-card-row').forEach((row) => {
        row.style.display = 'none';
      });

      for (let j = Math.floor(i / 2); j < Math.floor(i / 2) + 2; j++) {
        const row = document.getElementById(`row-${j}`);
        if (row) row.style.display = 'flex';
      }

      // ========== AGREGAR CONTENIDO (header y cards) PRIMERO ==========
      const headerCanvas = await html2canvas(document.getElementById('pdf-header'), {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const headerImgData = headerCanvas.toDataURL('image/png');
      const headerImgWidth = pageWidth - margin * 2;
      const headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width;

      pdf.addImage(headerImgData, 'PNG', margin, margin, headerImgWidth, headerImgHeight);

      // Capture and add the current batch of cards
      const cardsCanvas = await html2canvas(document.getElementById('cards-container'), {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const cardsImgData = cardsCanvas.toDataURL('image/png');
      const cardsImgWidth = pageWidth - margin * 2;
      const cardsImgHeight = (cardsCanvas.height * cardsImgWidth) / cardsCanvas.width;

      pdf.addImage(cardsImgData, 'PNG', margin, margin + headerImgHeight + 5, cardsImgWidth, cardsImgHeight);

      // ========== MARCAS DE AGUA (DESPUÉS, SOBRE EL CONTENIDO) ==========
      // IMPORTANTE: Agregar marcas de agua DESPUÉS del contenido con opacidad baja
      const addWatermarks = async (pdf, pageWidth, pageHeight) => {
        const watermarkSize = 30; // Tamaño base en mm
        const spacingX = 70; // Espaciado horizontal reducido para mejor cobertura
        const spacingY = 90; // Espaciado vertical reducido para mejor cobertura
        
        // Helper para cargar imagen directamente desde módulo importado
        const imageToBase64 = (imgModule) => {
          return new Promise((resolve, reject) => {
            try {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  reject(new Error('Canvas context not available'));
                  return;
                }
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                resolve({ dataUrl, width: img.width, height: img.height });
              };
              img.onerror = () => reject(new Error('Image failed to load: ' + imgModule));
              img.src = imgModule;
            } catch (err) {
              reject(err);
            }
          });
        };

        try {
          // Cargar logos desde módulos importados con sus dimensiones
          const logo1Data = await imageToBase64(logo1);
          const logo2Data = await imageToBase64(logo2);

          // Configurar opacidad baja para que sea sutil (marca de agua sobre contenido)
          const gState = new pdf.GState({ opacity: 0.12 });
          pdf.setGState(gState);

          // Cubrir toda la página con marcas de agua en patrón repetido
          // Comenzar desde el inicio (0,0) para cubrir toda la superficie
          for (let y = 0; y < pageHeight; y += spacingY) {
            for (let x = 0; x < pageWidth; x += spacingX) {
              // Alternar entre logo1 y logo2 en patrón de ajedrez
              const isLogo1 = (Math.floor(x / spacingX) + Math.floor(y / spacingY)) % 2 === 0;
              const logoData = isLogo1 ? logo1Data : logo2Data;
              
              // Calcular dimensiones manteniendo el ratio de aspecto
              const aspectRatio = logoData.width / logoData.height;
              let imgWidth = watermarkSize;
              let imgHeight = watermarkSize;
              
              if (aspectRatio > 1) {
                // Imagen más ancha que alta
                imgHeight = watermarkSize / aspectRatio;
              } else if (aspectRatio < 1) {
                // Imagen más alta que ancha
                imgWidth = watermarkSize * aspectRatio;
              }
              
              // Centrar la imagen en el espacio asignado
              const offsetX = (watermarkSize - imgWidth) / 2;
              const offsetY = (watermarkSize - imgHeight) / 2;
              
              pdf.addImage(
                logoData.dataUrl,
                'PNG',
                x + offsetX,
                y + offsetY,
                imgWidth,
                imgHeight
              );
            }
          }

          // Restaurar opacidad normal
          pdf.setGState(new pdf.GState({ opacity: 1 }));
        } catch (error) {
          console.error('Error adding watermarks:', error);
          // Fallback: agregar patrón de texto si las imágenes no cargan
          const gState = new pdf.GState({ opacity: 0.08 });
          pdf.setGState(gState);
          
          pdf.setFontSize(10);
          pdf.setTextColor(128, 128, 128);
          // Repetir patrón de texto en toda la página
          for (let y = 20; y < pageHeight; y += spacingY) {
            for (let x = 10; x < pageWidth - 30; x += spacingX) {
              const text = (Math.floor(x / spacingX) + Math.floor(y / spacingY)) % 2 === 0 ? 'VÁLIDO' : 'OFICIAL';
              pdf.text(text, x + spacingX / 2, y, { angle: 45, align: 'center' }); // Centrado
            }
          }
          
          pdf.setGState(new pdf.GState({ opacity: 1 }));
        }
      };

      // Aplicar marcas de agua DESPUÉS del contenido (sobre él)
      await addWatermarks(pdf, pageWidth, pageHeight);
    }

    // Reset display for all rows
    document.querySelectorAll('.bingo-card-row').forEach((row) => {
      row.style.display = 'flex';
    });

    // Hide container again
    input.style.display = 'none';

    pdf.save(`Cartillas_Bingo_${event?.name || 'Evento'}.pdf`);
  };

  const renderBingoCard = (bingoCard, index) => {
    const cardSize = {
      height: '48px', // Increased from 45px for slightly larger cells
      width: '48px', // Increased from 45px for slightly larger cells
      fontSize: '18px',
      minWidth: 'unset',
      padding: '0px'
    };

    const headerStyle = {
      color: '#FFF',
      fontWeight: 'bold',
      ...cardSize
    };

    return (
      <div
        key={index}
        style={{
          display: 'inline-block',
          margin: '8px', // Decreased from 15px
          border: '2px solid #ccc',
          padding: '10px', // Decreased from 15px
          width: '300px', // Increased from 280px
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          textAlign: 'center' // Ensure internal content is centered
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '16px' }}>
          {' '}
          {/* Increased font size */}
          <strong>Cartilla #{bingoCard.order || index + 1}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {' '}
          {/* Center the bingo grid */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" style={{ ...headerStyle }}>
              B
            </Button>
            {bingoCard.b.map((item, key) => (
              <Button key={'b' + key} variant="outlined" style={cardSize}>
                {item}
              </Button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" style={{ ...headerStyle }}>
              I
            </Button>
            {bingoCard.i.map((item, key) => (
              <Button key={'i' + key} variant="outlined" style={cardSize}>
                {item}
              </Button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" style={{ ...headerStyle }}>
              N
            </Button>
            {bingoCard.n.map((item, key) =>
              item === 'FREE' ? (
                <Button key={'n' + key} variant="contained" style={{ ...cardSize, color: '#FFF' }}>
                  F
                </Button>
              ) : (
                <Button key={'n' + key} variant="outlined" style={cardSize}>
                  {item}
                </Button>
              )
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" style={{ ...headerStyle }}>
              G
            </Button>
            {bingoCard.g.map((item, key) => (
              <Button key={'g' + key} variant="outlined" style={cardSize}>
                {item}
              </Button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" style={{ ...headerStyle }}>
              O
            </Button>
            {bingoCard.o.map((item, key) => (
              <Button key={'o' + key} variant="outlined" style={cardSize}>
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '5px', color: '#666' }}>
          {' '}
          {/* Increased font size and margin */}
          ID: {bingoCard.id ? bingoCard.id.substring(0, 8) : 'N/A'}
        </div>
      </div>
    );
  };

  // Organize cards with 2 per row for a maximum of 4 per page
  const organizeCards = () => {
    const cardsPerRow = 2;
    const rows = Math.ceil(bingoCards.length / cardsPerRow);
    const result = [];

    for (let i = 0; i < rows; i++) {
      const rowCards = bingoCards.slice(i * cardsPerRow, (i + 1) * cardsPerRow);
      result.push(
        <div
          id={`row-${i}`}
          key={`row-${i}`}
          className="bingo-card-row"
          style={{
            display: 'flex',
            justifyContent: 'space-evenly', // Changed from 'center' to 'space-evenly'
            marginBottom: '12px', // Decreased from 20px
            gap: '10px', // Decreased from 20px
            width: '100%' // Ensure the row takes full width
          }}
        >
          {rowCards.map((card, index) => renderBingoCard(card, i * cardsPerRow + index))}
        </div>
      );
    }

    return result;
  };

  return (
    <>
      {/* Hidden div that will be rendered to PDF */}
      <div
        ref={pdfRef}
        style={{
          display: 'none',
          background: '#FFF',
          padding: '10px', // Decreased from 15px
          textAlign: 'center',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {/* Event and User Information Header */}
        <div
          id="pdf-header"
          style={{
            marginBottom: '10px', // Decreased from 15px
            textAlign: 'left',
            borderBottom: '1px solid #ccc',
            paddingBottom: '8px' // Decreased from 10px
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{event?.name || 'Evento de Bingo'}</h2>
              <p style={{ fontSize: '14px', margin: '0' }}>
                Fecha:{' '}
                {event?.startDate
                  ? new Date(event.startDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : 'No especificada'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>Usuario: {user?.fullName || 'No especificado'}</p>
              <p style={{ fontSize: '14px', margin: '0' }}>Correo: {user?.email || 'No especificado'}</p>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Cartillas de Bingo</h3>
        <div id="cards-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {organizeCards()}
        </div>
      </div>

      <Button variant="contained" onClick={async () => await generatePDF()} color="primary" startIcon={<PictureAsPdfIcon />} style={{ color: '#FFF' }}>
        Descargar PDF
      </Button>
    </>
  );
};

BingoCardsPdf.propTypes = {
  bingoCards: PropTypes.array.isRequired,
  event: PropTypes.object,
  user: PropTypes.object
};
