import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { CategoryService } from '../../providers/category/category.service';
import { ElementRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
interface TeamMember {
  id: number;
  image: string;
  name: string;
  position: string;
}

@Component({
  selector: 'app-about',

  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  baseUrl: string = environment.url;
  imagePath: any;
  bannerData: any;
  companyHistory = {
    shortIntro: 'Since 1982, we have transformed strategically located land into fully developed, ready-to-build residential layouts across Hubballi-Dharwad. We specialize in providing NA plots for sale with 100% clear titles and rigorously verified legal paperwork. Whether you are looking for an investment or a place to build your future, our 40+ years of expertise ensure a secure and transparent buying experience',
    fullDescription: `
    <p><strong>Neelgund Construction: Your Vision, Our Expertise</strong></p>
    <p class="gray-text">Building a home is a lifetime milestone that should be hassle-free. We provide end-to-end construction services, managing everything from 2D floor plans and 3D elevations to securing government approvals. Our expert team of engineers and architects uses top-quality materials to deliver ready-to-move-in homes that fit your lifestyle and budget.</p>
    <p><strong>Neelgund Club: Superior Property Maintenance</strong></p>
    <p class="gray-text">We believe your plot is the foundation of your family’s financial security. Through Neelgund Club, we protect the value of your property by maintaining our layouts ourselves. From continuous water supply and 365-day street lighting to routine pest control and lush green plantations, we ensure your gated community plots in Hubli remain a pristine sanctuary.</p>
  `,
    image: 'history.jpg'
  };

  founder = {
    name: 'Mr. Neelgund',
    image: 'founder.jpg',
    quote: 'Quality and trust are not built overnight, they are earned over decades.',
    message: 'As the founder of Neelgund Developers, my vision has always been to create legally sound and thoughtfully planned developments that generations can rely on.'
  };

  ceo = {
    name: 'Mohd. Suleman Neelgund',
    role: 'Managing Director',
    quote: 'Innovation with responsibility is the future of real estate.',
    message: "Real estate is not just about spaces; it's about realizing dreams and creating legacies. At Neelgund, we dedicate ourselves to crafting spaces that embrace the future, honor our commitments, and exceed expectations"
  };

  whoWeAre = {
    description: 'We are a leading real estate developer with over 40 years of experience delivering plotted, residential, and commercial developments.',
    experience: '40+ Years',
    regions: ['Hubli', 'Dharwad', 'North Karnataka']
  };

  sustainability = [
    'Rainwater harvesting',
    'Solar-ready layouts',
    'Eco-friendly materials',
    'Green landscaping'
  ];
  visionMissionValues = {
    vision: 'To empower every family with the opportunity to own land and build their dream home, through ethical, economical, and high-quality plot development and construction services',
    mission: 'To become the most trusted plot developers and construction partners in the region by delivering well-planned layouts, transparent processes, and customer-centric homebuilding solutions',
    values: 'We value trust, quality, and customer satisfaction above everything. From safe, compliant plots to reliable construction, we ensure every customer experiences comfort, clarity, and confidence at every step'
  };
  whyChooseUs = [
    'On-time delivery',
    'Legal transparency',
    'Quality materials',
    'Customer-first approach',
    'Dedicated after-sales support'
  ];
  portfolioCategories = [
    { title: 'Residential Projects', count: 30, icon: 'fa-home' },
    { title: 'Commercial Spaces', count: 15, icon: 'fa-building' },
    { title: 'Villas & Plots', count: 20, icon: 'fa-map' },
    { title: 'Mixed-use Developments', count: 8, icon: 'fa-city' }
  ];

  certifications = ['RERA Approved', 'ISO Certified', 'Government Approved Layouts'];


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService, private el: ElementRef
  ) {
    this.imagePath = environment.baseUrl + '/public/';
    this.getAboutdata();
    this.getBannerdata();
    this.getAllcounterData();
  }
  isBrowser: boolean = isPlatformBrowser(this.platformId);
  aboutData: any = [];
  counterData: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
  teamMembers: TeamMember[] = [
    {
      id: 1,
      image: '/assets/images/aboutus/team-photos/team-01.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 2,
      image: '/assets/images/aboutus/team-photos/team-02.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 3,
      image: '/assets/images/aboutus/team-photos/team-03.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 4,
      image: '/assets/images/aboutus/team-photos/team-04.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 5,
      image: '/assets/images/aboutus/team-photos/team-05.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 6,
      image: '/assets/images/aboutus/team-photos/team-06.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 7,
      image: '/assets/images/aboutus/team-photos/team-07.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 8,
      image: '/assets/images/aboutus/team-photos/team-08.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 9,
      image: '/assets/images/aboutus/team-photos/team-09.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 10,
      image: '/assets/images/aboutus/team-photos/team-10.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 11,
      image: '/assets/images/aboutus/team-photos/team-11.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 12,
      image: '/assets/images/aboutus/team-photos/team-12.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 13,
      image: '/assets/images/aboutus/team-photos/team-13.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 14,
      image: '/assets/images/aboutus/team-photos/team-14.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 15,
      image: '/assets/images/aboutus/team-photos/team-15.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // this.initScrollTrigger();
  }
  initScrollTrigger(): void {
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      }
    });
    tl.from('.sub-heading', {
      yPercent: -500,
    }, .5)

      .from('.heading', {
        yPercent: -200,
        duration: 2,
      }, .5)
      .from('.description', {
        yPercent: -200,
        duration: 2,
      }, .8)
      .from('.button', {
        opacity: 1,
        duration: 2,
      }, 1)
      .from('.content-animate', {
        clipPath: 'inset(0 0 100% 0)',
      }, .5);


    const scrollElems = gsap.utils.toArray('.scroll-animate') as HTMLElement[];

    scrollElems.forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)',
        ease: 'power3.inOut',
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
        }
      });
    });

  }
  getAboutdata() {
    let obj = {};
    this.dataService.getAllAbout(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let temppage = response.result.filter((pagesection: any) => pagesection.page_section == 'about');
          if (temppage && temppage.length > 0) {
            this.aboutData = temppage;
          }
        }
      }
    });
  }
  getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let tempcat = response.result.filter((cat: any) => cat.name == 'about');
          if (tempcat && tempcat.length > 0) {
            this.bannerData = tempcat;
          }
        } else {
        }
      }
    });
  }

  getAllcounterData() {
    let obj = {};
    this.dataService.getcounterData(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.counterData = response.result;
      }
    });
  }

}