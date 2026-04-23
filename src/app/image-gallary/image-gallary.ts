import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-gallary',
  imports: [CommonModule, FormsModule],
  templateUrl: './image-gallary.html',
  styleUrl: './image-gallary.scss'
})
export class ImageGallary {
  imgArr: string[] = [];
  dragOver: boolean = false;
  uploadProgress: number = 0;
  maxFileSize: number = 5 * 1024 * 1024; // 5MB
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  onFileChange(event: any) {
    const files = event.target.files;
    this.processFiles(files);
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    const files = event.dataTransfer.files;
    this.processFiles(files);
  }

  processFiles(files: FileList) {
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!this.allowedFormats.includes(file.type)) {
        console.warn(`Invalid file format: ${file.name}. Allowed formats: JPG, PNG, GIF, WebP`);
        continue;
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        console.warn(`File too large: ${file.name}. Maximum size is 5MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event: any) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          this.imgArr.push(result);
        }
      };
      reader.onerror = () => {
        console.error(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  removeImage(index: number) {
    this.imgArr.splice(index, 1);
  }

  downloadImage(img: string, index: number) {
    const link = document.createElement('a');
    link.href = img;
    link.download = `image-${index}.jpg`;
    link.click();
  }

  clearAll() {
    if (confirm('Are you sure you want to delete all images?')) {
      this.imgArr = [];
    }
  }
}
