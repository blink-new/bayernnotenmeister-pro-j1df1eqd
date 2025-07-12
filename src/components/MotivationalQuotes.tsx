import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, RefreshCw, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface MotivationalQuote {
  text: string;
  author: string;
  category: 'bavarian' | 'motivation' | 'learning' | 'success';
}

const quotes: MotivationalQuote[] = [
  // Bavarian/German Educational
  { text: "Wer nicht kämpft, hat schon verloren.", author: "Bayerisches Sprichwort", category: 'bavarian' },
  { text: "Übung macht den Meister.", author: "Deutsches Sprichwort", category: 'bavarian' },
  { text: "Wer rastet, der rostet.", author: "Bayerischer Volksmund", category: 'bavarian' },
  { text: "Des is ma wuascht - aber die Noten ned!", author: "Bayerischer Schülerspruch", category: 'bavarian' },
  { text: "Pack ma's o - mit System und Hirn!", author: "Münchner Weisheit", category: 'bavarian' },
  
  // Learning & Education
  { text: "Bildung ist der mächtigste Motor für Veränderung in der Welt.", author: "Nelson Mandela", category: 'learning' },
  { text: "Jeder Experte war einmal ein Anfänger.", author: "Robin Sharma", category: 'learning' },
  { text: "Lernen ist wie Rudern gegen den Strom. Hört man damit auf, treibt man zurück.", author: "Laozi", category: 'learning' },
  { text: "Das Gehirn ist wie ein Muskel - je mehr du es benutzt, desto stärker wird es.", author: "Idowu Koyenikan", category: 'learning' },
  { text: "Wissen ist Macht, aber Wissen anwenden ist Superkraft.", author: "Unbekannt", category: 'learning' },
  
  // Motivation & Success
  { text: "Der Weg zum Erfolg ist, dass man die nächste richtige Entscheidung trifft.", author: "Steve Jobs", category: 'motivation' },
  { text: "Du bist stärker als du denkst und schlauer als du glaubst.", author: "Unbekannt", category: 'motivation' },
  { text: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden.", author: "Robert Collier", category: 'success' },
  { text: "Das Geheimnis des Erfolgs ist anzufangen.", author: "Mark Twain", category: 'success' },
  { text: "Träume groß und hab den Mut, zu scheitern.", author: "Norman Vaughan", category: 'motivation' },
  
  // Study-specific
  { text: "Eine gute Note ist der schönste Lohn für harte Arbeit.", author: "Unbekannt", category: 'success' },
  { text: "Prüfungen zeigen nicht was du nicht weißt, sondern was du schon gelernt hast.", author: "Unbekannt", category: 'learning' },
  { text: "Jede schwere Prüfung macht dich stärker für die nächste.", author: "Unbekannt", category: 'motivation' },
  { text: "Gute Noten sind das Ergebnis von Vorbereitung, harter Arbeit und Lernen aus Fehlern.", author: "Unbekannt", category: 'success' },
  { text: "Dein Notenschnitt definiert dich nicht - aber deine Anstrengung schon.", author: "Unbekannt", category: 'motivation' },
  
  // Fun Bavarian Student Life
  { text: "Lieber a gscheiden Dreier als a damischer Einser.", author: "Bayerischer Studentenspruch", category: 'bavarian' },
  { text: "Ned hudeln, aber gas geben!", author: "Münchner Schülerweisheit", category: 'bavarian' },
  { text: "Mia san mia - und mia lernen fleißig!", author: "FC Bayern Lernmotto", category: 'bavarian' },
  { text: "A ordentliches Zeugnis is wie a Mass Bier - schön anzuschauen und macht glücklich!", author: "Augustiner Weisheit", category: 'bavarian' },
];

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(quotes[0]);
  const [favoriteQuotes, setFavoriteQuotes] = useState<string[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Load favorite quotes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bayernnotenmeister-favorite-quotes');
    if (saved) {
      setFavoriteQuotes(JSON.parse(saved));
    }
  }, []);

  // Save favorite quotes to localStorage
  useEffect(() => {
    localStorage.setItem('bayernnotenmeister-favorite-quotes', JSON.stringify(favoriteQuotes));
  }, [favoriteQuotes]);

  // Daily quote rotation
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('bayernnotenmeister-quote-date');
    const savedIndex = localStorage.getItem('bayernnotenmeister-quote-index');

    if (savedDate === today && savedIndex) {
      const index = parseInt(savedIndex);
      setQuoteIndex(index);
      setCurrentQuote(quotes[index]);
    } else {
      // New day, new quote
      const newIndex = Math.floor(Math.random() * quotes.length);
      setQuoteIndex(newIndex);
      setCurrentQuote(quotes[newIndex]);
      localStorage.setItem('bayernnotenmeister-quote-date', today);
      localStorage.setItem('bayernnotenmeister-quote-index', newIndex.toString());
    }
  }, []);

  const getNextQuote = () => {
    const newIndex = (quoteIndex + 1) % quotes.length;
    setQuoteIndex(newIndex);
    setCurrentQuote(quotes[newIndex]);
    localStorage.setItem('bayernnotenmeister-quote-index', newIndex.toString());
  };

  const toggleFavorite = () => {
    const quoteKey = `${currentQuote.text}-${currentQuote.author}`;
    if (favoriteQuotes.includes(quoteKey)) {
      setFavoriteQuotes(prev => prev.filter(q => q !== quoteKey));
    } else {
      setFavoriteQuotes(prev => [...prev, quoteKey]);
    }
  };

  const isFavorite = favoriteQuotes.includes(`${currentQuote.text}-${currentQuote.author}`);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'bavarian': return '🇩🇪';
      case 'motivation': return '💪';
      case 'learning': return '📚';
      case 'success': return '🏆';
      default: return '✨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bavarian': return 'from-blue-500 to-white';
      case 'motivation': return 'from-red-500 to-orange-500';
      case 'learning': return 'from-green-500 to-emerald-500';
      case 'success': return 'from-yellow-500 to-orange-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${getCategoryColor(currentQuote.category)} p-6 text-white relative`}>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className="text-white hover:bg-white/20 p-2"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={getNextQuote}
              className="text-white hover:bg-white/20 p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="pr-20">
            <div className="flex items-center gap-2 mb-4">
              <Quote className="w-6 h-6" />
              <span className="text-lg font-semibold">
                Motivation des Tages {getCategoryEmoji(currentQuote.category)}
              </span>
            </div>

            <motion.div
              key={currentQuote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-4">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-sm opacity-90 font-medium">
                — {currentQuote.author}
              </cite>
            </motion.div>
          </div>
        </div>

        {favoriteQuotes.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 fill-current text-red-500" />
              <span>{favoriteQuotes.length} Lieblingszitate gespeichert</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}