import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-phases',
  templateUrl: './project-phases.component.html',
  styleUrls: ['./project-phases.component.scss']
})
export class ProjectPhasesComponent implements OnChanges {
  @Input() phases: any = [];
  @Input() imagePath = '';

  normalizedPhases: any[] = [];
  selectedIndex = 0;
  selectedPhase: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    const phaseChange = changes['phases'];
    if (phaseChange) {
      this.normalizedPhases = this.normalizePhases(phaseChange.currentValue);
      if (this.normalizedPhases.length) {
        this.selectPhase(0);
      } else {
        this.selectedPhase = null;
      }
    }
  }

  selectPhase(index: number): void {
    this.selectedIndex = index;
    this.selectedPhase = this.normalizedPhases[index] || null;
  }

  get phaseImage(): string | null {
    if (!this.selectedPhase) {
      return null;
    }
    return this.selectedPhase.image || this.selectedPhase.project_images?.[0] || null;
  }

  get phaseDetails(): { label: string; value: string; icon: string }[] {
    if (!this.selectedPhase) {
      return [];
    }
    const details: { label: string; value: string; icon: string }[] = [];

    if (this.selectedPhase.area) {
      details.push({ label: 'Area', value: this.selectedPhase.area, icon: 'fas fa-chart-area text-primary me-2' });
    }
    if (this.selectedPhase.noofplots || this.selectedPhase.plots) {
      details.push({ label: 'Plots', value: this.selectedPhase.noofplots || this.selectedPhase.plots, icon: 'fas fa-th text-primary me-2' });
    }
    if (this.selectedPhase.dimentions) {
      details.push({ label: 'Dimensions', value: this.selectedPhase.dimentions, icon: 'fas fa-ruler-combined text-primary me-2' });
    }
    if (this.selectedPhase.price) {
      details.push({ label: 'Price', value: this.selectedPhase.price, icon: 'fas fa-tags text-primary me-2' });
    }
    if (this.selectedPhase.location) {
      details.push({ label: 'Location', value: this.selectedPhase.location, icon: 'fas fa-map-marker-alt text-primary me-2' });
    }

    return details;
  }

  get additionalPhaseFields(): { label: string; value: string }[] {
    if (!this.selectedPhase) {
      return [];
    }

    const skipKeys = new Set(['name', 'description', 'image', 'project_images', 'area', 'noofplots', 'plots', 'dimentions', 'price', 'location']);
    return this.objectKeys(this.selectedPhase)
      .filter(key => this.selectedPhase[key] && !skipKeys.has(key))
      .map(key => ({ label: this.prettyKey(key), value: this.selectedPhase[key] }));
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

  normalizePhases(phases: any): any[] {
    if (!phases) {
      return [];
    }
    if (Array.isArray(phases)) {
      return phases.filter(phase => phase && typeof phase === 'object');
    }
    if (typeof phases === 'string') {
      try {
        const parsed = JSON.parse(phases);
        if (Array.isArray(parsed)) {
          return parsed.filter(phase => phase && typeof phase === 'object');
        }
      } catch {
        return [];
      }
    }
    if (typeof phases === 'object') {
      return [phases];
    }
    return [];
  }

  onImageLoad(): void {}
}
