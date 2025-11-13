import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import logo1 from 'assets/images/marca_agua/logo-contrato.png';
import logo2 from 'assets/images/marca_agua/logo-empresa.png';
import { getLetters } from 'utils/bingoConfig';

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

      // ========== MARCAS DE AGUA REMOVIDAS DEL DOCUMENTO COMPLETO ==========
      // Las marcas de agua ahora se agregan solo en cada cartilla individual
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

    const letters = getLetters();

    return (
      <div
        key={index}
        style={{
          display: 'inline-block',
          margin: '8px', // Decreased from 15px
          border: '3px solid #20a337',
          padding: '10px', // Decreased from 15px
          width: '300px', // Increased from 280px
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          textAlign: 'center', // Ensure internal content is centered
          position: 'relative', // Para posicionar las marcas de agua
          background: '#FFF',
          borderRadius: '10px'
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
          {letters.map((letter) => (
            <div key={letter} style={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" style={{ backgroundColor: '#20a337', color: '#FFF', ...headerStyle }}>
                {letter}
              </Button>
              {bingoCard[letter.toLowerCase()].map((item, key) =>
                item === 'FREE' ? (
                  <Button key={letter + key} variant="contained" style={{ backgroundColor: '#ffee00', color: '#20a337', ...cardSize }}>
                    F
                  </Button>
                ) : (
                  <Button key={letter + key} variant="outlined" style={{ borderColor: '#ffee00', color: '#20a337', ...cardSize }}>
                    {item}
                  </Button>
                )
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '5px', color: '#666' }}>
          {' '}
          {/* Increased font size and margin */}
          ID: {bingoCard.id ? bingoCard.id.substring(0, 8) : 'N/A'}
        </div>
        
        {/* Marca de agua del contrato centrada en la cartilla */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.1,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <img src={logo1} alt="contrato" style={{ width: '120px', height: 'auto' }} />
        </div>
        
        {/* Marca de agua de la empresa en la esquina superior derecha */}
        <div style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          opacity: 0.1,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <img src={logo2} alt="empresa" style={{ width: '80px', height: 'auto' }} />
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
        <div id="cards-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '710px' }}>
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
