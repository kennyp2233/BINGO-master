export function BingoCard() {
  var matrix = [];
  var b = [];
  var i = [];
  var n = [];
  var g = [];
  var o = [];

  for (var a = 0; a < 5; a++) {
    b[a] = Math.floor(Math.random() * (25 - 1 + 1)) + 1;
  }

  // Remove duplicates and ensure unique
  b = [...new Set(b)];
  while (b.length < 5) {
    const num = Math.floor(Math.random() * (25 - 1 + 1)) + 1;
    if (!b.includes(num)) b.push(num);
  }
  b.sort((a, b) => a - b);
  matrix.push(b);

  for (var a1 = 0; a1 < 5; a1++) {
    i[a1] = Math.floor(Math.random() * (50 - 26 + 1)) + 26;
  }

  i = [...new Set(i)];
  while (i.length < 5) {
    const num = Math.floor(Math.random() * (50 - 26 + 1)) + 26;
    if (!i.includes(num)) i.push(num);
  }
  i.sort((a, b) => a - b);
  matrix.push(i);

  for (var a2 = 0; a2 < 4; a2++) { // 4 for N since FREE in center
    n[a2] = Math.floor(Math.random() * (75 - 51 + 1)) + 51;
  }

  n = [...new Set(n)];
  while (n.length < 4) {
    const num = Math.floor(Math.random() * (75 - 51 + 1)) + 51;
    if (!n.includes(num)) n.push(num);
  }
  n.sort((a, b) => a - b);
  // Insert FREE in center
  n.splice(2, 0, 'FREE');
  matrix.push(n);

  for (var a3 = 0; a3 < 5; a3++) {
    g[a3] = Math.floor(Math.random() * (100 - 76 + 1)) + 76;
  }

  g = [...new Set(g)];
  while (g.length < 5) {
    const num = Math.floor(Math.random() * (100 - 76 + 1)) + 76;
    if (!g.includes(num)) g.push(num);
  }
  g.sort((a, b) => a - b);
  matrix.push(g);

  for (var a4 = 0; a4 < 5; a4++) {
    o[a4] = Math.floor(Math.random() * (125 - 101 + 1)) + 101;
  }

  o = [...new Set(o)];
  while (o.length < 5) {
    const num = Math.floor(Math.random() * (125 - 101 + 1)) + 101;
    if (!o.includes(num)) o.push(num);
  }
  o.sort((a, b) => a - b);
  matrix.push(o);

  return matrix;

  /*drawCard = () => {
    return `<div>
        <table>
            <tr>
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </tr>
            <tr>
                <td id="${matrix[0][0]}">${matrix[0][0]}</td>
                <td id="${matrix[1][0]}">${matrix[1][0]}</td>
                <td id="${matrix[2][0]}">${matrix[2][0]}</td>
                <td id="${matrix[3][0]}">${matrix[3][0]}</td>
                <td id="${matrix[4][0]}">${matrix[4][0]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][1]}">${matrix[0][1]}</td>
                <td id="${matrix[1][1]}">${matrix[1][1]}</td>
                <td id="${matrix[2][1]}">${matrix[2][1]}</td>
                <td id="${matrix[3][1]}">${matrix[3][1]}</td>
                <td id="${matrix[4][1]}">${matrix[4][1]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][2]}">${matrix[0][2]}</td>
                <td id="${matrix[1][2]}">${matrix[1][2]}</td>
                <td id="${matrix[2][2]}" style="background: black;><p id="free>FREE</p></td>
                <td id="${matrix[3][2]}">${matrix[3][2]}</td>
                <td id="${matrix[4][2]}">${matrix[4][2]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][3]}">${matrix[0][3]}</td>
                <td id="${matrix[1][3]}">${matrix[1][3]}</td>
                <td id="${matrix[2][3]}">${matrix[2][3]}</td>
                <td id="${matrix[3][3]}">${matrix[3][3]}</td>
                <td id="${matrix[4][3]}">${matrix[4][3]}</td>
            </tr>
            <tr>
                <td id="${matrix[0][4]}">${matrix[0][4]}</td>
                <td id="${matrix[1][4]}">${matrix[1][4]}</td>
                <td id="${matrix[2][4]}">${matrix[2][4]}</td>
                <td id="${matrix[3][4]}">${matrix[3][4]}</td>
                <td id="${matrix[4][4]}">${matrix[4][4]}</td>
            </tr>
        </table>
    </div>`;
  };*/
}
