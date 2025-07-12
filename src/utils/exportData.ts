import { Subject, GRADE_TYPES } from '../types';
import { calculateSubjectGrade, calculateOverallGPA, formatGrade } from './calculations';

export const exportToJSON = (subjects: Subject[], studentName?: string) => {
  const data = {
    studentName: studentName || 'Schüler',
    exportDate: new Date().toISOString(),
    overallGPA: calculateOverallGPA(subjects),
    subjects: subjects.map(subject => ({
      ...subject,
      calculatedGrade: calculateSubjectGrade(subject),
      formattedGrade: formatGrade(calculateSubjectGrade(subject))
    }))
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notenübersicht_${studentName || 'schüler'}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (subjects: Subject[], studentName?: string) => {
  const headers = ['Fach', 'Typ', 'Note', 'Gewicht', 'Datum', 'Beschreibung', 'Fachnote'];
  const rows = [];

  subjects.forEach(subject => {
    const subjectGrade = calculateSubjectGrade(subject);
    subject.grades.forEach(grade => {
      rows.push([
        subject.name,
        GRADE_TYPES[grade.type],
        grade.value.toString(),
        grade.weight.toString(),
        new Date(grade.date).toLocaleDateString('de-DE'),
        grade.description || '',
        formatGrade(subjectGrade)
      ]);
    });
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notenübersicht_${studentName || 'schüler'}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToHTML = (subjects: Subject[], studentName?: string) => {
  const overallGPA = calculateOverallGPA(subjects);
  
  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notenübersicht - ${studentName || 'Schüler'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .gpa-card { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
        .gpa-card h2 { margin: 0; font-size: 2em; }
        .gpa-card p { margin: 10px 0 0 0; opacity: 0.9; }
        .subject { background: #f8fafc; border-radius: 15px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea; }
        .subject h3 { margin: 0 0 15px 0; color: #2d3748; }
        .grade-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .grade-table th, .grade-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .grade-table th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        .grade-highlight { font-weight: bold; color: #667eea; }
        .footer { text-align: center; padding: 20px; color: #718096; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Notenübersicht</h1>
            <p>Erstellt am ${new Date().toLocaleDateString('de-DE')} • ${studentName || 'Schüler'}</p>
        </div>
        <div class="content">
            <div class="gpa-card">
                <h2>${formatGrade(overallGPA)}</h2>
                <p>Gesamtdurchschnitt</p>
            </div>
            ${subjects.filter(s => s.grades.length > 0).map(subject => {
              const subjectGrade = calculateSubjectGrade(subject);
              return `
                <div class="subject">
                    <h3>${subject.name} ${subject.isMainSubject ? '(Hauptfach)' : '(Nebenfach)'} - <span class="grade-highlight">${formatGrade(subjectGrade)}</span></h3>
                    <table class="grade-table">
                        <thead>
                            <tr>
                                <th>Typ</th>
                                <th>Note</th>
                                <th>Gewicht</th>
                                <th>Datum</th>
                                <th>Beschreibung</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subject.grades.map(grade => `
                                <tr>
                                    <td>${GRADE_TYPES[grade.type]}</td>
                                    <td>${grade.value}</td>
                                    <td>${grade.weight}</td>
                                    <td>${new Date(grade.date).toLocaleDateString('de-DE')}</td>
                                    <td>${grade.description || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
              `;
            }).join('')}
        </div>
        <div class="footer">
            <p>Erstellt mit ❤️ von Bayernnotenmeister Pro</p>
        </div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notenübersicht_${studentName || 'schüler'}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};