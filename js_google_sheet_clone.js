// Initialize 10x10 Spreadsheet
const initializeSpreadsheet = () => {
    const spreadsheet = document.getElementById('spreadsheet');
    const thead = spreadsheet.querySelector('thead tr');
    const tbody = spreadsheet.querySelector('tbody');
  
    // Clear current table
    thead.innerHTML = '<th></th>';
    tbody.innerHTML = '';
  
    // Generate column headers
    for (let i = 0; i < 10; i++) {
      const th = document.createElement('th');
      th.textContent = String.fromCharCode(65 + i); // A, B, C, ...
      thead.appendChild(th);
      // Create resize handle
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      th.appendChild(resizeHandle);

      th.style.position = "relative"; // Required for positioning handle
      thead.appendChild(th);
      console.log(`Column ${i} resize handle added`); // Debugging log

      // Attach event listener for resizing
      makeColumnResizable(th, i);
  }
  // Generate rows with columns
  for (let i = 1; i <= 10; i++) {
    const row = document.createElement('tr');
    const headerCell = document.createElement('td');
    headerCell.textContent = i; // Row number

     // Create row resize handle
     const rowResizeHandle = document.createElement('div');
     rowResizeHandle.className = 'row-resize-handle';
     headerCell.appendChild(rowResizeHandle);
     makeRowResizable(row, i);
     row.appendChild(headerCell);

    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('td');
      cell.contentEditable = true;
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
}