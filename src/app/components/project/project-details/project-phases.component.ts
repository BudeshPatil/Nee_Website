import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-phases',
  templateUrl: './project-phases.component.html',
  styleUrls: ['./project-phases.component.scss']
})
export class ProjectPhasesComponent implements OnChanges {
  @Input() phases: any[] = [];
  @Input() imagePath = '';

  selectedIndex = 0;
  selectedPhase: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phases) {
      if (this.phases && this.phases.length) {
        this.selectPhase(0);
      } else {
        this.selectedPhase = null;
      }
    }
  }

  selectPhase(index: number): void {
    this.selectedIndex = index;
    this.selectedPhase = this.phases[index];
  }

  isImageFile(name: string): boolean {
    return !!name && /\.(jpe?g|png|gif|webp|svg)$/i.test(name);
  }

  prettyKey(key: string): string {
    return key ? key.replace(/_/g, ' ') : key;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isArray(v: any): boolean {
    return Array.isArray(v);
  }

  onImageLoad(): void {}
}
