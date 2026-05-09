import { useState, useRef, useEffect } from 'react';
import { Send, GraduationCap, BookOpen, MapPin, CalendarDays, Sparkles, Building2 } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an official AI assistant for Harsha Institutions. 
Your purpose is to help prospective and current students with information about admissions, courses, fee structures, campus life, placements, and rules. 
Harsha Institutions is a top-tier degree college offering undergraduate and postgraduate programs in Science, Commerce, Arts, Management, and Computer Applications.

Use the following detailed knowledge base to answer student queries comprehensively:

🏛️ ADMINISTRATION:
- Principal: Harsha. Focuses on academic excellence, student development, and innovation in education. Ensures quality education, practical exposure, and career guidance.
- Chairman: Harshavardhan. Promotes modern learning methods, technology-based education, discipline, and overall student growth.
- Head of Department (HOD): Harshith Kumar. Guides students in academics, projects, internships, and technical skills. Encourages participation in workshops, seminars, and innovation.

📚 COURSES OFFERED:
Undergraduate (UG):
- B.A (Bachelor of Arts): 3 Years. Subjects: History, Political Science, English, Sociology.
- B.Com (Bachelor of Commerce): 3 Years. Subjects: Finance, Accounting, Banking, Taxation.
- B.Sc (Bachelor of Science): 3 Years. Subjects: Physics, Chemistry, Mathematics, Biotechnology.
- BCA (Bachelor of Computer Applications): 3 Years. Subjects: Programming, AI, Software Development.
- BBA (Bachelor of Business Administration): 3 Years. Subjects: Management, Marketing, HR.
- B.Tech / Engineering: 4 Years. Streams: Computer Science, Mechanical, Civil, ECE.
- B.Ed: 2 Years. Teacher training course.
- B.Pharm: 4 Years. Pharmacy and medicines.
Modern UG Specializations: Artificial Intelligence, Data Science, Cyber Security, Cloud Computing, Robotics, Digital Marketing.
Postgraduate (PG) - All 2 Years: M.A, M.Com, M.Sc, MBA, MCA, M.Tech.

📝 ADMISSION PROCESS:
1. Application Form: Online through the website or offline at the campus.
2. Eligibility: 12th standard completion for UG; Bachelor’s degree for PG.
3. Entrance Exams: JEE Main (Engineering), CUET (central universities), CAT/MAT (MBA), State CET for specific professional courses. Some direct admissions based on merit marks.
4. Document Verification: Marks cards, Transfer certificate (TC), Aadhaar, Passport photos, Caste/income certificates.
5. Fee Payment: Tuition, Admission, Lab/Library, Exam fees.
6. Counseling & Orientation: Introduction to rules, faculty, and academic schedules.

💰 AVERAGE FEE STRUCTURE (Approximate Annual Fees in INR - ₹):
- B.A / B.Com: ₹20,000 – ₹60,000
- B.Sc: ₹30,000 – ₹80,000
- BCA: ₹50,000 – ₹1,00,000
- BBA: ₹40,000 – ₹1,20,000
- B.Tech / Engineering: ₹80,000 – ₹2,50,000
- MBA: ₹1,00,000 – ₹4,00,000
Financial Aid: Scholarships, installment payment options, and government fee reimbursements available.

🏫 CAMPUS ENVIRONMENT, HOSTELS, & EXTRACURRICULARS:
Atmosphere: Friendly, diverse, smart classrooms, Wi-Fi campuses, digital libraries, innovation labs, and student clubs.
Activities: Sports, Hackathons, Tech fests, Cultural events, NSS/NCC, Entrepreneurship clubs.
Hostel Facilities: Secure for both boys and girls. Spacious/ventilated rooms, 24/7 water/electricity, Wi-Fi, hygienic food, separate study areas, CCTV/security, indoor/outdoor sports, medical support, laundry. 
Room Sharing Options: Single, Double, Triple, and Four sharing.

👨‍🏫 FACULTY & PLACEMENTS:
Experience: Most lecturers have 5–15 years of teaching experience. Highly qualified, skilled in modern teaching methods, provide project guidance and mentorship.
Teaching: Classroom lectures, practical labs, seminars, industrial visits, internships. 
Placements: Resume training, mock interviews, internships, and on-campus interviews (supported by HOD Harshith Kumar).
Top Recruiters: IT companies, Banks, Startups, Manufacturing, Marketing firms.

📜 RULES & REGULATIONS:
- Attendance: Minimum 75% attendance is strictly mandatory. Below 75% may not be allowed to appear for examinations. Regular attendance improves academic performance and discipline.
- Discipline: ID cards must be worn. Ragging is strictly prohibited (Anti-Ragging Policy).
- Dress Code: Uniforms/formal dress required, lab coats for practicals.
- Mobile Phones: Strictly restricted during classes, laboratories, and examinations.
- Exams: Strict anti-malpractice policies.

Be welcoming, professional, helpful, and clear in your answers. Format your output using clear markdown (e.g., bullet points, bolding). Keep answers concise but ensure they directly and accurately provide the requested information from the provided details.`;

type Message = {
  role: 'user' | 'model';
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Harsha Institutions! I'm our AI admissions assistant. How can I help you explore courses or plan your application today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.5,
        }
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: userText });
        const modelText = response.text || "I'm sorry, I couldn't generate a response. Please try asking again.";
        setMessages(prev => [...prev, { role: 'model', text: modelText }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now due to high volume. Please wait a moment and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Left Pane - University Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between bg-slate-900 border-r border-slate-200 p-12 text-white relative overflow-hidden shrink-0">
        {/* Background Accent */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-indigo-700/30 to-transparent blur-[100px] rounded-full z-0 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Harsha Institutions</h1>
          </div>
          
          <h2 className="text-5xl xl:text-6xl font-semibold leading-[1.1] mb-6 tracking-tight text-white drop-shadow-sm">
            Discover your future<br/>at Harsha.
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
            Our AI assistant is here to help you navigate admissions, explore top-tier courses, and plan your academic journey.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
              <CalendarDays className="text-indigo-400 mb-3" size={24} strokeWidth={1.5} />
              <h3 className="font-medium text-white mb-1">Admissions</h3>
              <p className="text-sm text-slate-400 leading-snug">Online & offline applications are open.</p>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
              <BookOpen className="text-indigo-400 mb-3" size={24} strokeWidth={1.5} />
              <h3 className="font-medium text-white mb-1">Programs</h3>
              <p className="text-sm text-slate-400 leading-snug">Top UG & PG courses including B.Tech, BCA.</p>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
              <Building2 className="text-indigo-400 mb-3" size={24} strokeWidth={1.5} />
              <h3 className="font-medium text-white mb-1">Campus Life</h3>
              <p className="text-sm text-slate-400 leading-snug">Smart classrooms, digital libraries, and sports.</p>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
              <MapPin className="text-indigo-400 mb-3" size={24} strokeWidth={1.5} />
              <h3 className="font-medium text-white mb-1">Placements</h3>
              <p className="text-sm text-slate-400 leading-snug">Top recruiters and career support available.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 flex justify-between items-center w-full max-w-lg mt-12">
          <span>© {new Date().getFullYear()} Harsha Institutions.</span>
          <span className="flex items-center gap-1 group cursor-pointer hover:text-slate-300 transition-colors">
            Admissions Office
          </span>
        </div>
      </div>

      {/* Right Pane - Chatbot */}
      <div className="flex-1 flex flex-col h-full bg-white relative shadow-2xl z-20">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-slate-100 bg-white">
           <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Harsha Institutions</h1>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 lg:px-12 pt-8 no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles size={14} className="text-indigo-600" />
                  </div>
                )}
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500">YOU</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isTyping && (
              <div className="flex gap-4 justify-start">
                 <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles size={14} className="text-indigo-600" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 lg:p-8 bg-white border-t border-slate-100 relative before:absolute before:-top-6 before:left-0 before:right-0 before:h-6 before:bg-gradient-to-t before:from-white before:to-transparent before:pointer-events-none">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isTyping}
                placeholder="Ask about admissions, courses, or campus life..."
                className="w-full py-4 pl-6 pr-14 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2.5 rounded-full bg-indigo-600 text-white disabled:bg-slate-200 disabled:text-slate-400 hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
              >
                <Send size={16} className={input.trim() && !isTyping ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
              </button>
            </div>
            <div className="text-center mt-4 text-[11px] font-medium text-slate-400">
              Harsha AI can make mistakes. Please verify important application deadlines with the admissions office.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
