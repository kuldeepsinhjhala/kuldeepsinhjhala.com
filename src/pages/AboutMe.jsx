"use client";

import { useState, useEffect, useRef } from "react";
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import {
	ChevronDown,
	ExternalLink,
	GitlabIcon as GitHub,
	Linkedin,
	Mail,
	MapPin,
	Award,
	BookOpen,
	Briefcase,
	Code,
	FileText,
	Layers,
	User,
	Heart,
	Phone,
	FileSearch,
} from "lucide-react";
// import Image from "next/image" - removed

// Internal CSS
const styles = {
	// Animation keyframes
	keyframes: `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes blob {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
    }
    
    @keyframes blob-slow {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(20px, -30px) rotate(5deg); }
      66% { transform: translate(-20px, 20px) rotate(-5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    
    @keyframes blob-slow-reverse {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(-30px, 20px) rotate(-5deg); }
      66% { transform: translate(20px, -20px) rotate(5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    
    @keyframes pulse-slow {
      0% { opacity: 0.5; }
      50% { opacity: 0.8; }
      100% { opacity: 0.5; }
    }
  `,

	// Global styles
	global: `
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 38 92% 50%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 38 92% 50%;
      --radius: 0.5rem;
    }
    
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --primary: 38 92% 50%;
      --primary-foreground: 222.2 47.4% 11.2%;
      --secondary: 217.2 32.6% 17.5%;
      --secondary-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
      --ring: 38 92% 50%;
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animate-blob-slow {
      animation: blob-slow 20s infinite;
    }
    
    .animate-blob-slow-reverse {
      animation: blob-slow-reverse 20s infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-3000 {
      animation-delay: 3s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }

    /* From globals.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      * {
        @apply border-border;
      }
      body {
        @apply bg-background text-foreground;
      }
    }

    @layer utilities {
      .animate-gradient-slow {
        animation: gradient 15s ease infinite;
        background-size: 200% 200%;
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    }
  `,
};

export default function Portfolio() {
	// Add internal CSS
	useEffect(() => {
		// Add keyframes and global styles
		const styleElement = document.createElement("style");
		styleElement.innerHTML = styles.keyframes + styles.global;
		document.head.appendChild(styleElement);

		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

	const [theme, setTheme] = useState("dark");
	const [activeSection, setActiveSection] = useState("about");
	const [isExpanded, setIsExpanded] = useState({});
	const sectionRefs = {
		about: useRef(null),
		experience: useRef(null),
		education: useRef(null),
		skills: useRef(null),
		projects: useRef(null),
		research: useRef(null),
		achievements: useRef(null),
		contact: useRef(null),
	};

	const { scrollY } = useScroll();
	const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);

	useEffect(() => {
		// Always set dark mode
		setTheme("dark");
		document.documentElement.classList.add("dark");

		// Add scroll event listener to update active section
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 200;

			// Find the current section
			Object.entries(sectionRefs).forEach(([section, ref]) => {
				if (
					ref.current &&
					scrollPosition >= ref.current.offsetTop &&
					scrollPosition < ref.current.offsetTop + ref.current.offsetHeight
				) {
					setActiveSection(section);
				}
			});
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.classList.toggle("dark");
	};

	const scrollToSection = (section) => {
		sectionRefs[section].current.scrollIntoView({ behavior: "smooth" });
		setActiveSection(section);
	};

	const toggleExpand = (id) => {
		setIsExpanded((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Data
	const personalInfo = {
		name: "Kuldeepsinh Jhala",
		title: "Software Developer Engineer | Research Enthusiast",
		location: "Vadodara, Gujarat, India",
		email: "kuldeephjhala@gmail.com",
		phone: "+91 9726413743",
		linkedin: "www.linkedin.com/in/kuldeepsinh--jhala",
		github: "github.com/kuldeepjhala-dev",
		image:
			"https://media.licdn.com/dms/image/v2/D4D03AQHkz0uJr2FBEQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708545280468?e=1747267200&v=beta&t=4SQCXb02Wh4xV1kkmt5BXc4eIcGuw2nEuxMHHGjFJQQ",
		about:
			"I am passionate about software development and engineering, constantly striving to learn and grow in my domain. I believe that engineering is not just about coding but about solving real-world problems through technology.",
	};

	const experience = [
		{
			id: "exp1",
			company: "Keshav Encon Private Limited",
			position: "Software Developer Engineer",
			type: "Full-time",
			duration: "Nov 2024 - Present · 5 mos",
			location: "Vadodara, Gujarat, India",
			mode: "On-site",
			description: [
				"Project-1: AI Resume",
				"• Designed a scalable 3NF database, integrating data from 10,000+ resumes using Gemma API and Google Colab.",
				"• Built the backend from scratch, enabling dynamic resume uploads and real-time data updates.",
				"• Conducted data field analysis from 50+ websites to develop an industry-standard database.",

				"Project-2: CRM",
				"• Developed and optimized a custom database architecture aligned with industry best practices.",
				"• Ensured scalability and maintainability through structured database design and optimization.",
				"• Implemented robust 3NF principles to enhance data integrity and efficiency.",

				"Project-3: Online Examination System",
				"• Designed an efficient, normalized database structure optimized for large-scale examinations.",
				"• Developed advanced algorithms to improve system performance and accuracy.",
				"• Project recognized by industry leaders like L&T and ABB for its innovative design and practical application.",
			],
			skills: [
				"Back-End Web Development",
				"Project Planning",
				"Node.js",
				"React.js",
			],
		},
		{
			id: "exp2",
			company: "Code Vimarsh",
			position: "Vice President",
			duration: "Jan 2024 - Present · 1 yr 3 mos",
			location: "The Maharaja Sayajirao University of Baroda",
			description: [
				"• Led an executive board of 14+ members and conducted weekly meetings to oversee chapter progress.",
				"• Managed a community of 300+ members, fostering innovation, collaboration, and learning.",
				"• Provided mentorship to 500+ students, guiding them on career and technical skills.",
				"• Supervised a team of 30+ junior developers working on web-based projects.",
			],
		},
		{
			id: "exp3",
			company: "MSU Vision 2020",
			position: "Student Ambassador",
			duration: "Jun 2023 - Aug 2023 · 3 mos",
			location: "The Maharaja Sayajirao University of Baroda",
			mode: "Hybrid",
			skills: ["Event Management", "Project Management"],
		},
		{
			id: "exp4",
			company: "iTechNotion Private Limited",
			position: "Android Developer",
			type: "Internship",
			duration: "May 2023 - Jun 2023 · 2 mos",
			location: "Ahmedabad, Gujarat, India",
			mode: "On-site",
			description: [
				"• Worked on a City Directory Android Application.",
				"• Implemented Google Map API and integrated data from company's backend services.",
				"• Designed and built custom navigation components with advanced UI features.",
				"• Created responsive layouts following Material Design 3 principles.",
				"• Developed a visually appealing splash screen with full-screen animations.",
				"• Tech Stack: Android, Java, Kotlin, XML, UI/UX design implementation from Figma",
			],
			skills: [
				"Mobile Application Development",
				"API",
				"Android",
				"Java",
				"Kotlin",
				"XML",
			],
		},
		{
			id: "exp5",
			company: "The Sparks Foundation",
			position: "Web Developer",
			type: "Internship",
			duration: "Jul 2022 - Jul 2022 · 1 mo",
			description: [
				"• Developed a Banking website with account transfer functionality.",
				"• Implemented secure transaction processing between user accounts.",
				"• Created responsive UI with modern design principles.",
				"• Tech Stack: MySQL, PHP, HTML, CSS, Bootstrap",
			],
			skills: [
				"PhpMyAdmin",
				"Cascading Style Sheets (CSS)",
				"PHP",
				"MySQL",
				"HTML",
			],
		},
	];

	const education = [
		{
			id: "edu1",
			institution: "The Maharaja Sayajirao University of Baroda",
			degree: "Bachelor of Engineering - BE, Computer Science and Engineering",
			duration: "Sep 2022 - Sep 2025",
			grade: "8.11 CGPA",
		},
		{
			id: "edu2",
			institution: "Gujarat Technological University (GTU)",
			degree: "Diploma in Computer Science",
			duration: "Jan 2019 - Jun 2022",
			grade: "9.67 CGPA",
			activities: [
				"• Institute Topper (1st rank).",
				"• Scored 10 SPI in 5th & 6th semester.",
				"• Winner of Inter-college Web Development competition.",
				"• Fireless Cooking competition winner.",
			],
			skills: [
				"jQuery",
				"DOM Manipulation",
				"PHP",
				"SQL",
				"Software Engineering",
			],
		},
		{
			id: "edu3",
			institution: "Baroda high school alkapuri",
			duration: "2007 - 2019",
			grade: "83%",
			activities: [
				"• Active member of Indian Navy NCC (National Cadet Corps).",
				"• Selected for Republic Day Camp (RDC) Delhi 2018.",
				"• Participated in Prime Minister's Rally in Delhi.",
				"• Recognized as Gujarat's best cadet.",
				"• Served as Head of computer department in BHS Alkapuri higher secondary section.",
			],
		},
	];

	const certifications = [
		{
			id: "cert1",
			name: "Namaste Node.js",
			issuer: "NamasteDev.com",
			date: "Feb 2025",
			credentialId: "AA9E13E330F6F4DA906B661AA6B",
			url: "https://namastedev.com/kuldeephjhala/certificates/namaste-node",
			skills: [
				"Node.js",
				"Routing",
				"MongoDB & Mongoose",
				"Event-driven Architecture",
				"File System Operations",
				"Asynchronous Programming",
				"Error Handling",
				"Deployment Strategies",
				"libuv",
				"Networking",
				"Understand SQL vs NoSQL",
				"Modules",
				"Authentication & Authorization",
				"Performance Optimization",
				"Event Loop",
				"Concurrency",
				"Using Mongo Compass",
				"RESTful APIs",
				"Security Best Practices",
				"Building Scalable Applications",
				"Non-blocking I/O",
				"Thread Pool",
				"Go to Production Strategies",
				"Express.js",
				"Working with Databases",
				"Working with APIs",
			],
		},
		{
			id: "cert2",
			name: "Namaste javascript",
			issuer: "NamasteDev.com",
			date: "Aug 2024",
			credentialId: "XT0TWQ",
			url: "https://namastedev.com/kuldeephjhala/certificates/namaste-javascript",
			skills: [
				"JavaScript Libraries",
				"JSON",
				"Javascript",
				"Vanilla JavaScript",
				"Embedded JavaScript (EJS)",
			],
		},
		{
			id: "cert3",
			name: "AWS CLOUD COMPUTING",
			issuer: "The Maharaja Sayajirao University of Baroda",
			date: "Jul 2024",
		},
		{
			id: "cert4",
			name: "Android App Development Bootcamp 2021 - Build a portfolio!",
			issuer: "Udemy",
			date: "Nov 2021",
			credentialId: "UC-1ded5ef0-9cc3-42ff-95b3-c74316a66a9f",
			url: "https://www.udemy.com/certificate/UC-1ded5ef0-9cc3-42ff-95b3-c74316a66a9f/",
			skills: ["Android", "Android Development"],
		},
		{
			id: "cert5",
			name: "Kotlin for Beginners: Learn Programming With Kotlin",
			issuer: "Udemy",
			date: "May 2021",
			credentialId: "UC-aed1e6b2-ac87-411c-8260-376d7a4eb8ff",
			url: "https://www.udemy.com/certificate/UC-aed1e6b2-ac87-411c-8260-376d7a4eb8ff/",
			skills: ["Android", "Android Development"],
		},
	];

	const achievements = [
		{
			id: "ach1",
			title: "Inter College Web Development Winner",
			issuer: "Gujarat Technological University, Ahmedabad",
			date: "Feb 2020",
			description:
				"Biggest challenge was we had to code in notepad and we were not allowed to access internet. It was an amazing experience. I got to learn how to build a project in certain time constraint environment.",
		},
		{
			id: "ach2",
			title:
				"NCC ex-cadet | RDC(Republic Day Camp) Delhi 2018 | PM(Prime minister) Rally Delhi",
			issuer: "NCC(National Cadet Corps) Ministry of Defence India",
			date: "Jan 2018",
			description:
				"• It gave me chance to stay with our Indian Officers at Delhi, also met Admiral Sunil Lanba, 23rd Chief of the Naval Staff of the Indian Navy.\n• Also Marched on CARIAPPA PARADE GROUND in Prime minister Rally 2018.\n• Got a chance to meet Prime minister of India.\nWith hardwork, dedication and training period of 6 months I got selected and represented Gujarat Directorate of NCC, from 2 Gujarat Naval Unit NCC.",
		},
		{
			id: "ach3",
			title: "Diploma Computer Science",
			score: "10 SPI",
			date: "Jun 2022",
			issuer: "Gujarat Technological University, Ahmedabad",
			description:
				"My current CGPA is 9.67 and I have scored 10 Spi(Semester per Index) in my 6th semester of Diploma in computer Engineering.",
		},
		{
			id: "ach4",
			title: "Diploma Computer Science",
			score: "10 SPI",
			date: "Dec 2021",
			issuer: "Gujarat Technological University, Ahmedabad",
			description:
				"I have scored 10 Spi(Semester per Index) in my 5th semester of Diploma Engineering.",
		},
	];

	const projects = [
		{
			id: "proj1",
			title: "Faculty Management System",
			technologies:
				"MERN (MongoDB, Express.js, React.js, Node.js), Firebase, Tailwind",
			description:
				"The Faculty Management System is a comprehensive web application designed using MERN stack to streamline the administrative and academic tasks, including user and faculty management, subject and timetable management, attendance and marks tracking, notice management, providing study materials and automated email notifications.",
		},
		{
			id: "proj2",
			title: "Cozy Stays",
			technologies: "HTML, CSS, JavaScript, EJS, Bootstrap, MongoDB",
			description:
				"Cozy Stay is a user-friendly platform where users can list their houses and browse other available accommodations. The site provides easy navigation and contact information for seamless communication.",
		},
		{
			id: "proj3",
			title: "Nerd2Fit",
			technologies: "HTML, CSS, JavaScript, Bootstrap",
			description:
				"Nerd2Fit is a fitness website. Which guides you throughout your home workout as well as gym workout.",
		},
	];

	const research = {
		title: "Quint Sorting Algorithm",
		status: "Under review",
		journal: "International Journal Of Applied and Computational Mathematics",
		advisor:
			"Dr. Viral Kapadia (Deputy Director at Computer Centre & Associate Professor, MSU)",
		description:
			"Quint Sort is an innovative hybrid sorting algorithm that combines the strengths of quick sort and count sort to deliver enhanced performance and efficiency. This algorithm dynamically assesses the arrangement of input elements and adapts its strategy accordingly.",
		highlights: [
			"• Developed a novel hybrid sorting algorithm that outperforms traditional methods",
			"• Conducted extensive performance analysis across various data distributions",
			"• Implemented optimizations for both time and space complexity",
			"• Demonstrated up to 30% improvement in sorting efficiency for specific data patterns",
		],
		technologies: [
			"Algorithm Design",
			"Data Structures",
			"Performance Analysis",
			"C++",
		],
	};

	const skills = [
		{
			category: "Programming Languages",
			items: [
				"JavaScript (Intermediate)",
				"Java",
				"Python (Beginner)",
				"C/C++",
			],
		},
		{
			category: "Database",
			items: ["MySQL", "MongoDB", "Firebase (Beginner)"],
		},
		{
			category: "Web Development (MERN Stack)",
			items: [
				"React.js",
				"Node.js",
				"Express.js",
				"HTML",
				"CSS",
				"Bootstrap",
				"Tailwind",
			],
		},
		{
			category: "App Development (Android)",
			items: ["Java", "XML", "Figma to android UI design"],
		},
		{
			category: "Tools",
			items: ["Git & GitHub", "Postman"],
		},
		{
			category: "Languages",
			items: [
				"English (Full Professional)",
				"Gujarati (Native or Bilingual)",
				"Hindi (Native or Bilingual)",
			],
		},
	];

	const posts = [
		{
			id: "post1",
			title: "Completed Node.js Course",
			date: "1 month ago",
			content:
				'🚀 "First, solve the problem. Then, write the code." – John Johnson\n\nI\'m beyond excited to share that I have successfully completed an in-depth Node.js course, mastering everything from fundamentals to building scalable, production-ready applications! 🎉\n\nThrough this journey, I have gained hands-on expertise in:\n✅ Node.js Fundamentals – Understanding the core of JavaScript runtime\n✅ Asynchronous Programming & Event Loop – Mastering Non-blocking I/O\n✅ RESTful APIs & Express.js – Crafting scalable backend systems\n✅ Authentication & Authorization – Implementing security best practices\n✅ MongoDB & Mongoose – Efficiently handling databases\n✅ Performance Optimization & Deployment – Ensuring production-grade applications\n✅ Event-driven Architecture & Concurrency – Managing async operations efficiently\n✅ Industry Best Practices & Real-world Projects – Writing clean, maintainable, and scalable code',
			likes: 31,
			impressions: 864,
		},
		{
			id: "post2",
			title: "Completed Namaste JavaScript Course",
			date: "6 months ago",
			content:
				"🎉 I Just Completed the Namaste JavaScript Course! 🎉\n\nSuper excited to announce that I've completed the Namaste JavaScript course by Akshay Saini 🚀, and it was an incredible learning experience! This course really dives deep into JavaScript fundamentals and advanced concepts, helping me understand how JavaScript works under the hood. 🚀",
			likes: 53,
			impressions: 1744,
		},
	];

	return (
		<div className="min-h-screen w-full dark transition-colors duration-300">
			{/* Animated Gradient Background */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				{/* Dark mode background only */}
				<div className="absolute inset-0">
					{/* Main gradient background */}
					<div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900"></div>

					{/* Animated gradient orbs */}
					<div className="absolute top-0 left-0 w-[80vw] h-[80vw] rounded-full bg-gradient-to-r from-purple-900/20 via-indigo-800/20 to-blue-900/20 blur-3xl animate-blob-slow"></div>
					<div className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] rounded-full bg-gradient-to-l from-blue-800/20 via-violet-900/20 to-indigo-800/20 blur-3xl animate-blob-slow-reverse animation-delay-2000"></div>
					<div className="absolute bottom-1/4 right-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-indigo-900/20 via-purple-800/20 to-blue-900/20 blur-3xl animate-blob animation-delay-4000"></div>

					{/* Subtle pulse effects */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.1),transparent_60%)] animate-pulse-slow"></div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(75,0,130,0.1),transparent_50%)] animate-pulse-slow animation-delay-3000"></div>
				</div>
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Header */}
				<motion.header
					style={{ opacity: headerOpacity }}
					className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-neutral-200/50 dark:border-neutral-800/50">
					<div className="container mx-auto px-4 py-4 flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							className="flex items-center space-x-2">
							<span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
								KJ
							</span>
						</motion.div>

						<nav className="hidden md:flex items-center space-x-6">
							{Object.keys(sectionRefs).map((section) => (
								<motion.button
									key={section}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => scrollToSection(section)}
									className={`text-sm font-medium capitalize ${
										activeSection === section
											? "text-amber-600 dark:text-amber-400"
											: "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
									}`}>
									{section}
								</motion.button>
							))}
						</nav>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							className="w-10">
							{/* Spacer to maintain layout */}
						</motion.div>
					</div>
				</motion.header>

				{/* Main Content */}
				<main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
					{/* About Section */}
					<section ref={sectionRefs.about} className="py-16">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="grid md:grid-cols-[1fr_2fr] gap-8 items-center">
							<div className="flex flex-col items-center md:items-start">
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.8,
										type: "spring",
										stiffness: 100,
									}}
									className="relative w-48 h-48 mb-6 overflow-hidden rounded-full shadow-xl">
									<div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 opacity-20 z-10"></div>
									<div className="absolute inset-0 border-4 border-amber-500/30 dark:border-amber-400/30 rounded-full z-20"></div>
									<img
										src="https://media.licdn.com/dms/image/v2/D4D03AQHkz0uJr2FBEQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1708545280468?e=1747267200&v=beta&t=M9GM4-hwGdhVSOyc3pnWPw5-B9koeufaos2fh3b1WC0"
										alt={personalInfo.name}
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
								</motion.div>

								<div className="flex flex-col items-center md:items-start space-y-2">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2, duration: 0.5 }}
										className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<MapPin
											size={16}
											className="text-amber-600 dark:text-amber-400"
										/>
										<span className="text-sm">{personalInfo.location}</span>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3, duration: 0.5 }}
										className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<Mail
											size={16}
											className="text-amber-600 dark:text-amber-400"
										/>
										<a
											href={`mailto:${personalInfo.email}`}
											className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
											{personalInfo.email}
										</a>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4, duration: 0.5 }}
										className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<Phone
											size={16}
											className="text-amber-600 dark:text-amber-400"
										/>
										<a
											href={`tel:${personalInfo.phone}`}
											className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
											{personalInfo.phone}
										</a>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5, duration: 0.5 }}
										className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<Linkedin
											size={16}
											className="text-amber-600 dark:text-amber-400"
										/>
										<a
											href={`https://${personalInfo.linkedin}`}
											target="_blank"
											rel="noopener noreferrer"
											className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
											LinkedIn
										</a>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6, duration: 0.5 }}
										className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<GitHub
											size={16}
											className="text-amber-600 dark:text-amber-400"
										/>
										<a
											href={`https://${personalInfo.github}`}
											target="_blank"
											rel="noopener noreferrer"
											className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
											GitHub
										</a>
									</motion.div>
								</div>
							</div>

							<div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 2 }}>
									<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
										{personalInfo.name.split(" ").map((word, wordIndex) => (
											<span
												key={wordIndex}
												className="inline-block mr-4 last:mr-0">
												{word.split("").map((letter, letterIndex) => (
													<motion.span
														key={`${wordIndex}-${letterIndex}`}
														initial={{ y: 50, opacity: 0 }}
														animate={{ y: 0, opacity: 1 }}
														transition={{
															delay: wordIndex * 0.1 + letterIndex * 0.03,
															type: "spring",
															stiffness: 150,
															damping: 25,
														}}
														className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
														{letter}
													</motion.span>
												))}
											</span>
										))}
									</h1>
								</motion.div>

								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.8 }}
									className="text-xl md:text-2xl font-medium mb-6 text-neutral-700 dark:text-neutral-300">
									{personalInfo.title}
								</motion.h2>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7, duration: 0.8 }}
									className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
									{personalInfo.about}
								</motion.p>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.9, duration: 0.8 }}
									className="flex flex-wrap gap-4">
									<a
										href="#contact"
										onClick={(e) => {
											e.preventDefault();
											scrollToSection("contact");
										}}
										className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-500/20 dark:shadow-amber-400/10">
										Contact Me
									</a>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											scrollToSection("experience");
										}}
										className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400 dark:hover:text-black shadow-lg hover:shadow-amber-500/20 dark:shadow-amber-400/10">
										View Experience
									</a>
								</motion.div>
							</div>
						</motion.div>
					</section>

					{/* Experience Section */}
					<section ref={sectionRefs.experience} className="py-16">
						<SectionHeader icon={<Briefcase />} title="Experience" />

						<div className="mt-8 space-y-8">
							{experience.map((exp, index) => (
								<motion.div
									key={exp.id}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="relative">
									<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-300 dark:from-amber-400 dark:via-amber-300 dark:to-amber-200 ml-3"></div>

									<div className="flex gap-6">
										<div className="relative z-10 mt-1.5">
											<div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20">
												<Briefcase size={14} />
											</div>
										</div>

										<div className="flex-1 backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10">
											<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
												<h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
													{exp.position}
												</h3>
												<span className="text-sm text-neutral-500 dark:text-neutral-400">
													{exp.duration}
												</span>
											</div>

											<div className="flex items-center text-neutral-700 dark:text-neutral-300 mb-4">
												<span className="font-medium">{exp.company}</span>
												{exp.type && (
													<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
														{exp.type}
													</span>
												)}
												{exp.mode && (
													<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
														{exp.mode}
													</span>
												)}
											</div>

											{exp.location && (
												<div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
													<MapPin
														size={14}
														className="mr-1 text-amber-500 dark:text-amber-400"
													/>
													<span>{exp.location}</span>
												</div>
											)}

											{exp.description && (
												<div className="mt-4">
													<AnimatePresence>
														{isExpanded[exp.id] ||
														exp.description.length <= 3 ? (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
																{exp.description.map((item, i) => (
																	<p key={i}>{item}</p>
																))}
															</motion.div>
														) : (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
																{exp.description.slice(0, 3).map((item, i) => (
																	<p key={i}>{item}</p>
																))}
															</motion.div>
														)}
													</AnimatePresence>

													{exp.description.length > 3 && (
														<button
															onClick={() => toggleExpand(exp.id)}
															className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
															{isExpanded[exp.id] ? "Show less" : "Show more"}
															<ChevronDown
																size={16}
																className={`ml-1 transition-transform ${
																	isExpanded[exp.id] ? "rotate-180" : ""
																}`}
															/>
														</button>
													)}
												</div>
											)}

											{exp.skills && exp.skills.length > 0 && (
												<div className="mt-4 flex flex-wrap gap-2">
													{exp.skills.map((skill, i) => (
														<span
															key={i}
															className="px-2 py-1 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
															{skill}
														</span>
													))}
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</section>

					{/* Education Section */}
					<section ref={sectionRefs.education} className="py-16">
						<SectionHeader icon={<BookOpen />} title="Education" />

						<div className="mt-8 space-y-8">
							{education.map((edu, index) => (
								<motion.div
									key={edu.id}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="relative">
									<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-300 dark:from-amber-400 dark:via-amber-300 dark:to-amber-200 ml-3"></div>

									<div className="flex gap-6">
										<div className="relative z-10 mt-1.5">
											<div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20">
												<BookOpen size={14} />
											</div>
										</div>

										<div className="flex-1 backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10">
											<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
												<h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
													{edu.institution}
												</h3>
												<span className="text-sm text-neutral-500 dark:text-neutral-400">
													{edu.duration}
												</span>
											</div>

											{edu.degree && (
												<div className="text-neutral-700 dark:text-neutral-300 mb-2">
													{edu.degree}
												</div>
											)}

											{edu.grade && (
												<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
													Grade:{" "}
													<span className="font-medium text-amber-600 dark:text-amber-400">
														{edu.grade}
													</span>
												</div>
											)}

											{edu.activities && (
												<div className="mt-4">
													<AnimatePresence>
														{isExpanded[edu.id] ||
														edu.activities.length <= 3 ? (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
																{edu.activities.map((item, i) => (
																	<p key={i}>{item}</p>
																))}
															</motion.div>
														) : (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
																{edu.activities.slice(0, 3).map((item, i) => (
																	<p key={i}>{item}</p>
																))}
															</motion.div>
														)}
													</AnimatePresence>

													{edu.activities.length > 3 && (
														<button
															onClick={() => toggleExpand(edu.id)}
															className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
															{isExpanded[edu.id] ? "Show less" : "Show more"}
															<ChevronDown
																size={16}
																className={`ml-1 transition-transform ${
																	isExpanded[edu.id] ? "rotate-180" : ""
																}`}
															/>
														</button>
													)}
												</div>
											)}

											{edu.skills && edu.skills.length > 0 && (
												<div className="mt-4 flex flex-wrap gap-2">
													{edu.skills.map((skill, i) => (
														<span
															key={i}
															className="px-2 py-1 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
															{skill}
														</span>
													))}
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</section>

					{/* Skills Section */}
					<section ref={sectionRefs.skills} className="py-16">
						<SectionHeader icon={<Layers />} title="Skills" />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
							{skills.map((skillGroup, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10 hover:shadow-amber-500/10 dark:hover:shadow-amber-400/10 transition-shadow">
									<h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
										{skillGroup.category}
									</h3>

									<div className="flex flex-wrap gap-2">
										{skillGroup.items.map((skill, i) => (
											<motion.span
												key={i}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{
													delay: i * 0.05,
													duration: 0.3,
													type: "spring",
													stiffness: 200,
												}}
												className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50"
												whileHover={{ scale: 1.05 }}>
												{skill}
											</motion.span>
										))}
									</div>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							viewport={{ once: true, margin: "-100px" }}
							className="mt-8 backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10">
							<h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
								Certifications
							</h3>

							<div className="space-y-6">
								{certifications.map((cert, index) => (
									<div
										key={cert.id}
										className="border-b border-neutral-200/50 dark:border-neutral-800/50 last:border-0 pb-4 last:pb-0">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
											<h4 className="font-medium text-amber-700 dark:text-amber-300">
												{cert.name}
											</h4>
											<span className="text-sm text-neutral-500 dark:text-neutral-400">
												{cert.date}
											</span>
										</div>

										<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
											{cert.issuer}
											{cert.credentialId && (
												<span className="ml-2 text-xs text-neutral-500 dark:text-neutral-500">
													ID: {cert.credentialId}
												</span>
											)}
										</div>

										{cert.url && (
											<a
												href={cert.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-amber-600 dark:text-amber-400 flex items-center mt-1 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
												View Certificate{" "}
												<ExternalLink size={14} className="ml-1" />
											</a>
										)}

										{cert.skills && cert.skills.length > 0 && (
											<div className="mt-3">
												<AnimatePresence>
													{isExpanded[cert.id] ? (
														<motion.div
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: "auto", opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															className="flex flex-wrap gap-2">
															{cert.skills.map((skill, i) => (
																<span
																	key={i}
																	className="px-2 py-1 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
																	{skill}
																</span>
															))}
														</motion.div>
													) : (
														<motion.div
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: "auto", opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															className="flex flex-wrap gap-2">
															{cert.skills.slice(0, 5).map((skill, i) => (
																<span
																	key={i}
																	className="px-2 py-1 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
																	{skill}
																</span>
															))}
															{cert.skills.length > 5 && (
																<span className="px-2 py-1 text-xs rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300">
																	+{cert.skills.length - 5} more
																</span>
															)}
														</motion.div>
													)}
												</AnimatePresence>

												{cert.skills.length > 5 && (
													<button
														onClick={() => toggleExpand(cert.id)}
														className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
														{isExpanded[cert.id]
															? "Show less"
															: "Show all skills"}
														<ChevronDown
															size={14}
															className={`ml-1 transition-transform ${
																isExpanded[cert.id] ? "rotate-180" : ""
															}`}
														/>
													</button>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</motion.div>
					</section>

					{/* Projects Section */}
					<section ref={sectionRefs.projects} className="py-16">
						<SectionHeader icon={<Code />} title="Projects" />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
							{projects.map((project, index) => (
								<motion.div
									key={project.id}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10 hover:shadow-amber-500/10 dark:hover:shadow-amber-400/10 transition-all hover:translate-y-[-2px]">
									<h3 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
										{project.title}
									</h3>

									{project.technologies && (
										<div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
											<span className="font-medium text-amber-700 dark:text-amber-300">
												Technologies:
											</span>{" "}
											{project.technologies}
										</div>
									)}

									<p className="text-neutral-600 dark:text-neutral-400 text-sm">
										{project.description}
									</p>
								</motion.div>
							))}
						</div>
					</section>

					{/* Research Section */}
					<section ref={sectionRefs.research} className="py-16">
						<SectionHeader icon={<FileSearch />} title="Research" />

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true, margin: "-100px" }}
							className="mt-8 backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-8 shadow-lg border border-white/20 dark:border-white/10 relative overflow-hidden">
							{/* Decorative elements */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
							<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-tr-full"></div>

							<div className="relative z-10">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
									<div className="flex-1">
										<h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200 mb-2">
											{research.title}
										</h3>

										<div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
											<div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
												<span className="font-medium text-amber-700 dark:text-amber-300 mr-1">
													Status:
												</span>
												<span className="px-2 py-0.5 text-xs rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
													{research.status}
												</span>
											</div>

											<div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
												<span className="font-medium text-amber-700 dark:text-amber-300 mr-1">
													Journal:
												</span>
												{research.journal}
											</div>
										</div>

										<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
											<span className="font-medium text-amber-700 dark:text-amber-300">
												Advisor:
											</span>{" "}
											{research.advisor}
										</div>

										<p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
											{research.description}
										</p>

										<div className="space-y-2 mb-6">
											<h4 className="font-medium text-amber-700 dark:text-amber-300">
												Key Highlights:
											</h4>
											{research.highlights.map((highlight, index) => (
												<p
													key={index}
													className="text-sm text-neutral-600 dark:text-neutral-400">
													{highlight}
												</p>
											))}
										</div>
									</div>

									<div className="md:w-64 bg-gradient-to-br from-amber-50/80 to-white/60 dark:from-amber-900/20 dark:to-black/40 rounded-lg p-4 shadow-inner border border-amber-100/50 dark:border-amber-800/30">
										<h4 className="font-medium text-amber-700 dark:text-amber-300 mb-3 text-center">
											Technologies
										</h4>
										<div className="flex flex-wrap gap-2 justify-center">
											{research.technologies.map((tech, index) => (
												<motion.span
													key={index}
													initial={{ scale: 0.8, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{
														delay: index * 0.1,
														duration: 0.3,
														type: "spring",
														stiffness: 200,
													}}
													className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50"
													whileHover={{ scale: 1.05 }}>
													{tech}
												</motion.span>
											))}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</section>

					{/* Achievements Section */}
					<section ref={sectionRefs.achievements} className="py-16">
						<SectionHeader icon={<Award />} title="Achievements" />

						<div className="mt-8 space-y-8">
							{achievements.map((achievement, index) => (
								<motion.div
									key={achievement.id}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="relative">
									<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-300 dark:from-amber-400 dark:via-amber-300 dark:to-amber-200 ml-3"></div>

									<div className="flex gap-6">
										<div className="relative z-10 mt-1.5">
											<div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20">
												<Award size={14} />
											</div>
										</div>

										<div className="flex-1 backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10">
											<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
												<h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
													{achievement.title}
												</h3>
												<span className="text-sm text-neutral-500 dark:text-neutral-400">
													{achievement.date}
												</span>
											</div>

											{achievement.issuer && (
												<div className="text-neutral-700 dark:text-neutral-300 mb-2">
													{achievement.issuer}
												</div>
											)}

											{achievement.score && (
												<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
													Score:{" "}
													<span className="font-medium text-amber-600 dark:text-amber-400">
														{achievement.score}
													</span>
												</div>
											)}

											{achievement.description && (
												<div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
													{achievement.description}
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</section>

					{/* Social Activity Section */}
					<section className="py-16">
						<SectionHeader icon={<FileText />} title="Recent Posts" />

						<div className="mt-8 space-y-6">
							{posts.map((post, index) => (
								<motion.div
									key={post.id}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true, margin: "-100px" }}
									className="backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/10">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-amber-700 dark:text-amber-300">
											{post.title}
										</h3>
										<span className="text-sm text-neutral-500 dark:text-neutral-400">
											{post.date}
										</span>
									</div>

									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 whitespace-pre-line">
										{isExpanded[post.id]
											? post.content
											: `${post.content.substring(0, 200)}${
													post.content.length > 200 ? "..." : ""
											  }`}

										{post.content.length > 200 && (
											<button
												onClick={() => toggleExpand(post.id)}
												className="ml-1 text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
												{isExpanded[post.id] ? "Show less" : "Read more"}
											</button>
										)}
									</div>

									<div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
										<span className="flex items-center">
											<Heart
												size={14}
												className="mr-1 text-amber-500 dark:text-amber-400"
											/>
											{post.likes} likes
										</span>
										{post.impressions && (
											<span className="ml-4 flex items-center">
												<EyeIcon
													size={14}
													className="mr-1 text-amber-500 dark:text-amber-400"
												/>
												{post.impressions} impressions
											</span>
										)}
									</div>
								</motion.div>
							))}
						</div>
					</section>

					{/* Contact Section */}
					<section ref={sectionRefs.contact} className="py-16">
						<SectionHeader icon={<User />} title="Contact" />

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true, margin: "-100px" }}
							className="backdrop-blur-sm bg-white/70 dark:bg-black/30 rounded-xl p-8 shadow-lg border border-white/20 dark:border-white/10">
							<div className="grid md:grid-cols-1 gap-8">
								<div>
									<h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
										Get In Touch
									</h3>
									<p className="text-neutral-600 dark:text-neutral-400 mb-6">
										Feel free to reach out if you want to collaborate on a
										project, have a question, or just want to connect.
									</p>

									<div className="space-y-4">
										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
												<Mail size={18} />
											</div>
											<div>
												<p className="text-sm text-neutral-500 dark:text-neutral-400">
													Email
												</p>
												<a
													href={`mailto:${personalInfo.email}`}
													className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
													{personalInfo.email}
												</a>
											</div>
										</div>

										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
												<Phone size={18} />
											</div>
											<div>
												<p className="text-sm text-neutral-500 dark:text-neutral-400">
													Phone
												</p>
												<a
													href={`tel:${personalInfo.phone}`}
													className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
													{personalInfo.phone}
												</a>
											</div>
										</div>

										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
												<MapPin size={18} />
											</div>
											<div>
												<p className="text-sm text-neutral-500 dark:text-neutral-400">
													Location
												</p>
												<p className="font-medium text-neutral-700 dark:text-white">
													{personalInfo.location}
												</p>
											</div>
										</div>

										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
												<Linkedin size={18} />
											</div>
											<div>
												<p className="text-sm text-neutral-500 dark:text-neutral-400">
													LinkedIn
												</p>
												<a
													href={`https://${personalInfo.linkedin}`}
													target="_blank"
													rel="noopener noreferrer"
													className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
													Connect on LinkedIn
												</a>
											</div>
										</div>

										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
												<GitHub size={18} />
											</div>
											<div>
												<p className="text-sm text-neutral-500 dark:text-neutral-400">
													GitHub
												</p>
												<a
													href={`https://${personalInfo.github}`}
													target="_blank"
													rel="noopener noreferrer"
													className="font-medium text-neutral-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
													View GitHub Profile
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</section>
				</main>

				{/* Footer */}
				<footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-8 backdrop-blur-sm bg-white/30 dark:bg-black/30">
					<div className="container mx-auto px-4 text-center">
						<p className="text-neutral-600 dark:text-neutral-400 text-sm">
							&copy; {new Date().getFullYear()} {personalInfo.name}. All rights
							reserved.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}

// Section Header Component
function SectionHeader({ icon, title }) {
	return (
		<div className="flex items-center space-x-3">
			<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10 dark:shadow-amber-400/10">
				{icon}
			</div>
			<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
				{title}
			</h2>
		</div>
	);
}

// Eye icon for impressions
function EyeIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}
