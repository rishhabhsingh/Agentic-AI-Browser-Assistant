const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');
const fs = require('fs');
const path = require('path');

async function generateResumeDocx(data) {
  const {
    fullName = 'Your Name',
    email = 'your.email@example.com',
    phone = '+1 234 567 8900',
    location = 'City, State',
    summary = 'Professional summary goes here...',
    experience = [],
    education = [],
    skills = [],
    jobTitle = 'Job Title'
  } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        new Paragraph({
          text: fullName.toUpperCase(),
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),

        // Contact Info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: email, size: 20 }),
            new TextRun({ text: ' | ', size: 20 }),
            new TextRun({ text: phone, size: 20 }),
            new TextRun({ text: ' | ', size: 20 }),
            new TextRun({ text: location, size: 20 })
          ],
          spacing: { after: 200 }
        }),

        // Professional Summary
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: 'single',
              size: 6
            }
          }
        }),

        new Paragraph({
          text: summary,
          spacing: { after: 200 }
        }),

        // Skills
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: 'single',
              size: 6
            }
          }
        }),

        new Paragraph({
          text: skills.join(' • ') || 'Add your skills here',
          spacing: { after: 200 }
        }),

        // Experience
        new Paragraph({
          text: 'PROFESSIONAL EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: 'single',
              size: 6
            }
          }
        }),

        ...generateExperienceSection(experience),

        // Education
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: 'single',
              size: 6
            }
          }
        }),

        ...generateEducationSection(education)
      ]
    }]
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  
  // Save to temp directory
  const fileName = `resume_${fullName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
  const filePath = path.join(__dirname, '../temp', fileName);
  
  // Create temp directory if it doesn't exist
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, buffer);
  
  return { fileName, filePath };
}

function generateExperienceSection(experience) {
  if (!experience || experience.length === 0) {
    return [
      new Paragraph({
        text: 'Job Title | Company Name',
        bold: true,
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: 'Month Year - Month Year',
        italics: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Add your achievements and responsibilities here',
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: '• Use bullet points to highlight key accomplishments',
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: '• Quantify results when possible',
        spacing: { after: 200 }
      })
    ];
  }

  const paragraphs = [];
  experience.forEach(exp => {
    paragraphs.push(
      new Paragraph({
        text: `${exp.title} | ${exp.company}`,
        bold: true,
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: `${exp.startDate} - ${exp.endDate}`,
        italics: true,
        spacing: { after: 100 }
      }),
      ...exp.responsibilities.map(resp => 
        new Paragraph({
          text: `• ${resp}`,
          spacing: { after: 50 }
        })
      ),
      new Paragraph({ text: '', spacing: { after: 100 } })
    );
  });

  return paragraphs;
}

function generateEducationSection(education) {
  if (!education || education.length === 0) {
    return [
      new Paragraph({
        text: 'Degree Name | University Name',
        bold: true,
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: 'Graduation Year | GPA: X.XX',
        italics: true,
        spacing: { after: 100 }
      })
    ];
  }

  const paragraphs = [];
  education.forEach(edu => {
    paragraphs.push(
      new Paragraph({
        text: `${edu.degree} | ${edu.university}`,
        bold: true,
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: `${edu.graduationYear}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`,
        italics: true,
        spacing: { after: 100 }
      })
    );
  });

  return paragraphs;
}

module.exports = { generateResumeDocx };