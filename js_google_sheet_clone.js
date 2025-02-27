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
  };
  
  const getSelectedCells = () => {
    const col = document.getElementById('col-select').value.toUpperCase();
    const rowStart = parseInt(document.getElementById('row-start').value, 10);
    const rowEnd = parseInt(document.getElementById('row-end').value, 10);
    const colIndex = col.charCodeAt(0) - 65;
  
    const cells = [];
    for (let i = rowStart; i <= rowEnd; i++) {
      const row = document.querySelector(`#spreadsheet tbody tr:nth-child(${i})`);
      if (row) {
        const cell = row.children[colIndex + 1];
        if (cell) cells.push(cell);
      }
    }
  
    return cells;
  };

  const applyFormat = (format) => {
    const selectedCells = getSelectedCells();
    selectedCells.forEach(cell => {
      switch (format) {
        case 'bold':
          cell.style.fontWeight = (cell.style.fontWeight === 'bold') ? 'normal' : 'bold';
          break;
        case 'italic':
          cell.style.fontStyle = (cell.style.fontStyle === 'italic') ? 'normal' : 'italic';
          break;
        case 'underline':
          cell.style.textDecoration = (cell.style.textDecoration === 'underline') ? 'none' : 'underline';
          break;
      }
    });
  };
  
  const performMathFunction = (func) => {
    const selectedCells = getSelectedCells();
    const values = selectedCells.map(cell => parseFloat(cell.textContent)).filter(val => !isNaN(val));
  
    let result;
    switch (func) {
      case 'sum':
        result = values.reduce((acc, val) => acc + val, 0);
        break;
      case 'average':
        result = values.reduce((acc, val) => acc + val, 0) / values.length;
        break;
      case 'max':
        result = Math.max(...values);
        break;
      case 'min':
        result = Math.min(...values);
        break;
      case 'count':
        result = values.length;
        break;
    }
  
    document.getElementById('result-display').textContent = `Result: ${result}`;
  };
  
  const performDataQuality = (operation) => {
    const selectedCells = getSelectedCells();
  
    selectedCells.forEach(cell => {
      switch (operation) {
        case 'trim':
          cell.textContent = cell.textContent.trim();
          break;
        case 'upper':
          cell.textContent = cell.textContent.toUpperCase();
          break;
        case 'lower':
          cell.textContent = cell.textContent.toLowerCase();
          break;
        case 'removeDuplicates':
          const uniqueValues = [...new Set(selectedCells.map(cell => cell.textContent))];
          selectedCells.forEach((cell, index) => {
            cell.textContent = uniqueValues[index] || '';
          });
          break;
      }
    });
  };
  
  const performFindAndReplace = () => {
    const findText = prompt("Enter text to find:");
    const replaceText = prompt("Enter text to replace with:");
    const selectedCells = getSelectedCells();
  
    selectedCells.forEach(cell => {
      cell.textContent = cell.textContent.replace(new RegExp(findText, 'g'), replaceText);
    });
  };
  
  const saveFile = () => {
    const spreadsheet = document.getElementById('spreadsheet');
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.table_to_sheet(spreadsheet); // Convert table to sheet
    
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Append sheet to workbook
    XLSX.writeFile(wb, "spreadsheet.xlsx"); // Save as file
};


const loadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Get first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to array

            populateTable(jsonData); // Fill the table with Excel data
        };

        reader.readAsArrayBuffer(file);
    };
    input.click();
};

const populateTable = (data) => {
    const spreadsheet = document.getElementById('spreadsheet');
    const tbody = spreadsheet.querySelector('tbody');
    tbody.innerHTML = ''; // Clear table before loading new data

    data.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');

        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.contentEditable = true;
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
};


const performOperation = () => {
    // Implement your perform operation logic here
    alert('Perform operation function not yet implemented.');
  };
  
  const generateChart = () => {
    const selectedCells = getSelectedCells();
    
    if (selectedCells.length === 0) {
        alert("No cells selected! Please select at least one column of numerical values.");
        return;
    }

    // Extract labels (row numbers) and values
    const labels = [];
    const values = [];
    
    selectedCells.forEach((cell, index) => {
        const num = parseFloat(cell.textContent);
        if (!isNaN(num)) {
            labels.push(`Row ${index + 1}`);
            values.push(num);
        }
    });

    if (values.length === 0) {
        alert("No numerical data found! Please enter numbers in the selected cells.");
        return;
    }

    // Create a chart container if not exists
    let chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';
        chartContainer.style.width = "500px";
        chartContainer.style.margin = "20px auto";
        document.body.appendChild(chartContainer);
    } else {
        chartContainer.innerHTML = ''; // Clear previous chart
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'chartCanvas';
    chartContainer.appendChild(canvas);

    // Load Chart.js dynamically if not loaded
    if (typeof Chart === "undefined") {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = () => drawChart(labels, values);
        document.head.appendChild(script);
    } else {
        drawChart(labels, values);
    }
};

// Function to draw the chart
const drawChart = (labels, values) => {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Selected Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
};

  
  const addRow = () => {
    const spreadsheet = document.getElementById('spreadsheet').querySelector('tbody');
    const newRow = document.createElement('tr');
    const rowCount = spreadsheet.childNodes.length + 1;
    const headerCell = document.createElement('td');
    headerCell.textContent = rowCount;
    newRow.appendChild(headerCell);
  
    const colCount = document.getElementById('spreadsheet').querySelector('thead tr').childElementCount - 1;
    for (let i = 0; i < colCount; i++) {
      const cell = document.createElement('td');
      cell.contentEditable = true;
      newRow.appendChild(cell);
    }
    spreadsheet.appendChild(newRow);
  };
  
  const deleteRow = () => {
    const spreadsheet = document.getElementById('spreadsheet').querySelector('tbody');
    if (spreadsheet.lastChild) {
      spreadsheet.removeChild(spreadsheet.lastChild);
    }
  };
  
  const resizeRow = () => {
    const rows = document.querySelectorAll("#spreadsheet tbody tr");

    rows.forEach(row => {
        const resizeHandle = document.createElement("div");
        resizeHandle.style.width = "100%";
        resizeHandle.style.height = "5px";
        resizeHandle.style.background = "transparent";
        resizeHandle.style.cursor = "ns-resize";
        resizeHandle.style.position = "absolute";
        resizeHandle.style.bottom = "0";
        resizeHandle.style.left = "0";

        row.style.position = "relative";
        row.appendChild(resizeHandle);

        let startY, startHeight;

        resizeHandle.addEventListener("mousedown", (event) => {
            startY = event.clientY;
            startHeight = row.offsetHeight;

            const mouseMoveHandler = (moveEvent) => {
                const newHeight = startHeight + (moveEvent.clientY - startY);
                row.style.height = `${newHeight}px`;
            };

            const mouseUpHandler = () => {
                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);
            };

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        });
    });
};


