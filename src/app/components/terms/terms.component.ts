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
      question: 'How do I submit a new construction or development project?',
      answer:
        'Use the contact form or email our team with the project name, location, site details, expected delivery timeline, and developer contact information. We will review your submission and publish it after verification.',
    },
    {
      question: 'What information is collected when I request a project quote?',
      answer:
        'We collect your name, email, phone number, project interest, and any message you submit. This information helps us respond to your request and share relevant construction and development project details.',
    },
    {
      question: 'Can I update project details after posting?',
      answer:
        'Yes. Contact our support team with the latest site plan, pricing, or feature updates, and we will revise the project listing once the information is verified.',
    },
    {
      question: 'How is my personal information protected?',
      answer:
        'We follow standard security practices to protect your data. Information transmitted through our forms is stored securely and only shared with authorized team members and service providers required to process your request.',
    },
    {
      question: 'What should I do if I find incorrect project information?',
      answer:
        'Report the issue immediately using the contact page. Provide the project name and the details that need correction, and we will investigate and update the listing as needed.',
    },
  ];

  toggleFaq(index: number): void {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
  }
}
