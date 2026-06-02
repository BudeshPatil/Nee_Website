import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
  expandedFaqIndex: number | null = 0;

  faqItems = [
    {
      question: 'Are your projects NA and KJP approved?',
      answer:
        'Yes, many of our projects are developed in compliance with applicable regulations, and NA and KJP-approved projects will have their registration details clearly mentioned. Please contact us for project-specific information.',
    },
    {
      question: 'What types of properties do you offer?',
      answer:
        'We primarily offer residential plots, gated community developments, and selected commercial plot opportunities in prime locations.',
    },
    {
      question: 'Where are your projects located?',
      answer:
        'Our projects are strategically located in and around Hubli-Dharwad, including Gadag Road, Kusugal Road, and other rapidly developing areas.',
    },
    {
      question: 'Do you provide bank loan assistance?',
      answer:
        'Yes. We can guide customers through the loan process and connect them with leading banks and financial institutions, subject to eligibility.',
    },
    {
      question: 'What documents will I receive after purchasing a plot?',
      answer:
        'You will receive all legally required documents, including sale deed documentation, approvals, and other relevant records associated with the project.',
    },
    {
      question: 'Can I visit the site before booking?',
      answer:
        'Absolutely. We encourage customers to schedule a site visit to inspect the location, amenities, and surrounding infrastructure before making a decision.',
    },
    {
      question:"What amenities are available in your layouts?",
      answer: "Amenities vary by project and may include wide roads, drainage systems, street lighting, parks, children's play areas, water supply, and gated security."
    },
    {
      question:"Are the plots suitable for immediate construction?",
      answer: "Many of our projects are developed with necessary infrastructure to support residential construction. Availability may vary by project"
    },
    {
      question:"Why choose Neelgund Developers?",
      answer:"With over 40 years of experience, 60+ projects, and thousands of satisfied customers, we focus on transparency, legal clarity, quality development, and customer satisfaction."
    }
  ];

  toggleFaq(index: number): void {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
  }
}
