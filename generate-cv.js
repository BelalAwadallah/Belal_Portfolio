import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Create a document
const doc = new PDFDocument({ margin: 50 });

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
const cvPath = path.join(process.cwd(), 'public', 'Belal_Awadallah_CV.pdf');
doc.pipe(fs.createWriteStream(cvPath));

// Add content
doc
  .fontSize(24)
  .font('Helvetica-Bold')
  .text('Belal Awadallah', { align: 'center' })
  .moveDown(0.5);

doc
  .fontSize(14)
  .font('Helvetica')
  .fillColor('gray')
  .text('Software Engineer', { align: 'center' })
  .moveDown(1.5);

doc.fillColor('black');

// About
doc.fontSize(16).font('Helvetica-Bold').text('About Me');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);
doc
  .fontSize(11)
  .font('Helvetica')
  .text(
    'I am a passionate Software Engineer with a strong foundation built using C++ and Java. I specialize in modern web development and frontend engineering, crafting scalable and high-performance applications. Currently expanding my expertise into backend engineering with .NET and robust database systems.'
  )
  .moveDown(1.5);

// Education
doc.fontSize(16).font('Helvetica-Bold').text('Education');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);
doc
  .fontSize(12)
  .font('Helvetica-Bold')
  .text('B.Sc. Information Technology - Expected Graduation: 2026')
  .fontSize(11)
  .font('Helvetica')
  .text('Delta University of Technology')
  .text('Software Engineering Track focusing on advanced system architecture, databases, and algorithms.')
  .moveDown(1.5);

// Skills
doc.fontSize(16).font('Helvetica-Bold').text('Technical Skills');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);

const skills = [
  'Languages: Java, C++, JavaScript (ES6+), TypeScript',
  'Frontend: Angular, React, HTML5, CSS3, Tailwind CSS, Three.js, GSAP',
  'Backend & DB: Node.js, Express, REST APIs, .NET, SQL Databases',
  'Tools & Methods: Git, Webpack, Vite, Responsive Design, State Management',
];

skills.forEach((skill) => {
  doc.fontSize(11).font('Helvetica').text(`• ${skill}`, { indent: 15 });
});
doc.moveDown(1.5);

// Projects
doc.fontSize(16).font('Helvetica-Bold').text('Featured Projects');
doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.5);

doc.fontSize(12).font('Helvetica-Bold').text('E-Commerce Platform');
doc.fontSize(11).font('Helvetica').text('Full-featured online store built using Angular and Tailwind CSS with product listings, shopping cart system, authentication, and checkout.').moveDown(0.5);

doc.fontSize(12).font('Helvetica-Bold').text('Weather Forecast App');
doc.fontSize(11).font('Helvetica').text('Real-time weather forecasting application using JavaScript and external REST APIs with a dynamic responsive UI.').moveDown(0.5);

doc.fontSize(12).font('Helvetica-Bold').text('Bookmark Manager');
doc.fontSize(11).font('Helvetica').text('Performant CRUD system for managing bookmarks with local storage persistence and robust data validation.').moveDown();

// Contact
doc.moveDown(2);
doc.fontSize(10).font('Helvetica-Oblique').text('Contact: belalawadallah891@gmail.com | LinkedIn: /in/belal-awadallah-3213b1288', { align: 'center' });

// Finalize PDF file
doc.end();

console.log('PDF Generated Successfully at ' + cvPath);
