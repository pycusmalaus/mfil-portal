import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TableModule, FileUploadModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  headers : string[] = [];  // Store column headers
  tableData: Record<string, any>[] = []; // Array of objects with string keys and any values

  // Handle file upload
  onFileSelect(event: any) {
    this.clearTableData(); // Clear previous data

    const file = event.files[0]; // Get the uploaded file
    if (!file) return ; // Safety check

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the worksheet to JSON (array of arrays)
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length) {
        // Extract headers from the first row
        this.headers = jsonData[0].map(header => header || 'Column');

        // Map remaining rows into objects with keys matching the headers
        this.tableData = jsonData.slice(1).map(row =>
          this.headers.reduce((acc: Record<string, any>, key: string, index: number) => {
            acc[key] = row[index] || ''; // Assign each cell to the appropriate key
            return acc;
          }, {})
        );

        console.log(this.tableData); // Debug to ensure data is correct
      }
    };

    reader.readAsArrayBuffer(file); // Start reading the file
  }

  // Clear table data
  clearTableData() {
    this.headers = [];
    this.tableData = [];
  }
}
