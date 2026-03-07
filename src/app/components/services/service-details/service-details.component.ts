import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent implements OnInit {
  service: any = null;

  // Static services data (same as in services component)
  services = [
    {
      name: 'Land and Plots',
      url_key: 'land-and-plots',
      short_description: 'Expert services for land acquisition, plot development, and real estate planning.',
      full_description: 'Our land and plots services encompass comprehensive solutions for identifying, acquiring, and developing prime land parcels. We handle everything from site surveys and feasibility studies to legal documentation and zoning compliance, ensuring your construction projects start on solid ground. With years of experience in the real estate market, we provide strategic advice to maximize the value and potential of your land investments.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Land acquisition and site selection',
        'Feasibility studies and market analysis',
        'Legal documentation and zoning compliance',
        'Site surveys and boundary demarcation',
        'Infrastructure planning and development'
      ]
    },
    {
      name: 'Constructions',
      url_key: 'constructions',
      short_description: 'Full-scale construction services from planning to completion with quality assurance.',
      full_description: 'From residential complexes to commercial buildings, our construction services deliver end-to-end project management. We specialize in modern construction techniques, sustainable building practices, and timely delivery. Our team of certified engineers, architects, and skilled laborers work together to transform your vision into reality, maintaining the highest standards of safety, quality, and efficiency throughout the entire construction process.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Project planning and architectural design',
        'Construction management and supervision',
        'Quality control and safety compliance',
        'Sustainable building practices',
        'Timely project delivery and handover'
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const urlKey = params['url_key'];
      this.service = this.services.find(s => s.url_key === urlKey);
    });
  }
}
