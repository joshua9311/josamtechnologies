import React, { useState } from 'react';
import { ServiceItem, ContactSettings } from '../../types';
import { api } from '../../lib/api';
import {
  Laptop,
  Wifi,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building,
  Landmark,
  FileText,
  HelpCircle,
  Compass,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Wrench,
  Zap,
  RotateCcw,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface CyberServicesSectionProps {
  services?: ServiceItem[];
  contact?: ContactSettings;
  onInquire?: (serviceName: string) => void;
  onInquirySubmitted?: () => void;
}

interface AssistanceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  suggestedPrompts: string[];
}

const ASSISTANCE_CATEGORIES: AssistanceCategory[] = [
  {
    id: 'tech_devices',
    name: 'Computer & Laptop Support',
    icon: Laptop,
    badge: 'PC, Mac, Windows & macOS Systems',
    description: 'System crashes, virus/malware removal, OS re-installation, software setup, printer connection, and computer diagnostics.',
    suggestedPrompts: [
      'My laptop or PC is running very slowly or crashing. Can you help diagnose and resolve it?',
      'Can you assist with Windows/Mac OS installation, MS Office setup, or antivirus software?',
      'How do I safely remove viruses/malware from my computer without losing my important files?',
      'My computer won\'t boot up properly or keeps freezing. What steps can we take?',
    ],
  },
  {
    id: 'kra',
    name: 'KRA iTax & Tax Compliance',
    icon: Landmark,
    badge: 'PIN, Returns, TCC, Penalties',
    description: 'Annual returns, nil returns, new PIN registration, tax compliance certificates, and penalty relief.',
    suggestedPrompts: [
      'How do I file my annual or nil tax returns for this year?',
      'I lost access to my KRA iTax email and password. How do I reset it?',
      'What documents are needed to apply for a Tax Compliance Certificate (TCC)?',
      'How do I verify or clear outstanding KRA penalties on my PIN?',
    ],
  },
  {
    id: 'helb',
    name: 'HELB & Student Portals',
    icon: GraduationCap,
    badge: 'Loans, Clearance, Reset',
    description: 'First-time undergraduate & TVET loan forms, subsequent loan status, and clearance certificates.',
    suggestedPrompts: [
      'What requirements and documents do I need for first-time HELB loan?',
      'How can I check the disbursement status of my subsequent HELB loan?',
      'How do I get a HELB Compliance / Clearance Certificate?',
      'My HELB smart portal account is locked. How do I regain access?',
    ],
  },
  {
    id: 'ecitizen',
    name: 'eCitizen, NTSA & Govt Portals',
    icon: Building,
    badge: 'Business, NTSA, DL, Good Conduct',
    description: 'Business name registration, official CR12 search, NTSA TIMS driving licence renewals, and police clearance.',
    suggestedPrompts: [
      'How do I register a business name or company on eCitizen?',
      'How long does an official CR12 document take and what is needed?',
      'What are the steps to renew my smart driving licence on NTSA TIMS?',
      'How do I book an appointment for Police Clearance (Good Conduct)?',
    ],
  },
  {
    id: 'security',
    name: 'Account Recovery & Digital Security',
    icon: ShieldCheck,
    badge: 'Passwords, 2FA, Email, Locked Accounts',
    description: 'Recover lost access to email accounts, government portals, social profiles, lost passwords, and 2-step verification.',
    suggestedPrompts: [
      'I forgot my email password and backup recovery options are no longer active. Can you help recover it?',
      'My portal account is locked after too many attempts. How do I unlock it?',
      'How can I secure my accounts and set up reliable two-factor authentication?',
      'I suspect my account was compromised. What immediate steps should I take?',
    ],
  },
  {
    id: 'network',
    name: 'Wi-Fi, Internet & Network Setup',
    icon: Wifi,
    badge: 'Routers, Networks, Connectivity',
    description: 'Wi-Fi router configuration, network printer connection, slow internet troubleshooting, and home/office local file sharing.',
    suggestedPrompts: [
      'How do I configure my Wi-Fi router and secure it with a strong password?',
      'My wireless printer won\'t connect to my laptop. Can you troubleshoot it?',
      'My internet connection keeps dropping or is unexpectedly slow. What should I check?',
      'Can you help set up shared network storage or office file sharing?',
    ],
  },
  {
    id: 'documents',
    name: 'Document Formatting & Typesetting',
    icon: FileText,
    badge: 'CV, Reports, Printing, PDF',
    description: 'Professional CV and cover letter redesign, academic and business report formatting, typing, and digital scanning.',
    suggestedPrompts: [
      'Can you redesign and format my CV and cover letter professionally?',
      'I have a draft or handwritten document that needs accurate typing & formatting.',
      'Can you convert, compress, and organize scanned PDF files for portal upload?',
      'Do you format university project reports according to academic guidelines?',
    ],
  },
  {
    id: 'guidance',
    name: 'Step-by-Step Portal & Tech Guidance',
    icon: Compass,
    badge: 'Walkthrough & Advice',
    description: 'Personalized guidance walking you through complicated portal steps, verification codes, and payments.',
    suggestedPrompts: [
      'Can you guide me step-by-step through an online portal process?',
      'The portal is showing an error during payment or submission. Can you help?',
      'What is the safest way to verify my identity and upload supporting documents?',
      'Can you review my submission details before I click final submit?',
    ],
  },
  {
    id: 'question',
    name: 'Ask a Specific Tech Question',
    icon: HelpCircle,
    badge: 'Requirements & Timelines',
    description: 'Ask any question about Kenyan government portals, processing times, service fees, or technical procedures.',
    suggestedPrompts: [
      'What are your service fees and expected turnaround times?',
      'Can I get my service handled completely online without visiting physically?',
      'What documents or software details do I need to prepare before starting?',
      'Is my personal data and national ID information handled securely?',
    ],
  },
  {
    id: 'custom',
    name: 'Any Other Tech Issue / General Help',
    icon: Sparkles,
    badge: 'Any Digital Challenge',
    description: 'Have a unique digital or hardware challenge not listed here? Josam Technologies diagnoses and solves any tech issue.',
    suggestedPrompts: [
      'I have an urgent tech issue that nobody else could figure out. Can you assist?',
      'Can you help me migrate data or backup photos from an old device to a new one?',
      'I need technical advice on what software or device to buy for my work.',
      'I have an error message on my screen and don\'t know what it means.',
    ],
  },
];

const ASSISTANCE_INTENTS = [
  { id: 'question', label: 'Ask a Question', icon: HelpCircle, desc: 'Clarity on requirements or steps' },
  { id: 'guidance', label: 'Need Guidance', icon: Compass, desc: 'Step-by-step walkthrough or advice' },
  { id: 'execution', label: 'Do It For Me', icon: Wrench, desc: 'Complete end-to-end service execution' },
  { id: 'urgent', label: 'Urgent / Same-Day', icon: Zap, desc: 'Time-critical or immediate deadline' },
];

export const CyberServicesSection: React.FC<CyberServicesSectionProps> = ({
  services = [],
  contact,
  onInquire,
  onInquirySubmitted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tech_devices');
  const [selectedIntent, setSelectedIntent] = useState<string>('question');
  const [questionText, setQuestionText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCategory =
    ASSISTANCE_CATEGORIES.find((c) => c.id === selectedCategory) || ASSISTANCE_CATEGORIES[0];
  const activeIntent =
    ASSISTANCE_INTENTS.find((i) => i.id === selectedIntent) || ASSISTANCE_INTENTS[0];

  const handleInquire = onInquire || ((_serviceName: string) => {
    const el = document.getElementById('inquiry');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleSelectPrompt = (prompt: string) => {
    setQuestionText(prompt);
    setErrorMessage(null);
  };

  const handleResetForm = () => {
    setQuestionText('');
    setName('');
    setPhone('');
    setEmail('');
    setSubmissionSuccess(false);
    setErrorMessage(null);
  };

  const handleWhatsAppDirect = () => {
    const textToSend = questionText.trim()
      ? questionText.trim()
      : `Hello Josam Technologies, I need assistance with ${activeCategory.name}.`;

    const message = [
      `*Josam Technologies - Cyber & Digital Assistance Request*`,
      `📂 *Category:* ${activeCategory.name}`,
      `🎯 *Need:* ${activeIntent.label}`,
      `📝 *Question / Request:*`,
      `"${textToSend}"`,
      ...(name.trim() ? [`👤 *Name:* ${name.trim()}`] : []),
      ...(phone.trim() ? [`📞 *Phone:* ${phone.trim()}`] : []),
    ].join('\n\n');

    const rawPhone = (contact?.whatsapp || contact?.phone || '254700000000').replace(/\D/g, '');
    const targetPhone = rawPhone.startsWith('0') ? `254${rawPhone.slice(1)}` : rawPhone;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!questionText.trim()) {
      setErrorMessage('Please enter your question or describe what assistance you need.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your name so we know whom to address.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address for official follow-up.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullServiceTitle = `Cyber & Digital: ${activeCategory.name} (${activeIntent.label})`;
      const fullDescription = [
        `[Category]: ${activeCategory.name}`,
        `[Intent]: ${activeIntent.label}`,
        `[Inquiry/Question]: ${questionText.trim()}`,
        phone.trim() ? `[Contact Phone]: ${phone.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await api.submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || 'Not provided',
        service: fullServiceTitle,
        description: fullDescription,
        preferredContact,
      });

      if (res.success) {
        setSubmissionSuccess(true);
        if (onInquirySubmitted) onInquirySubmitted();
      } else {
        setErrorMessage('Could not record your inquiry. Please try again or chat via WhatsApp.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit assistance request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeWhatsapp = contact?.whatsapp || '+254 700 000 000';
  const safePhone = contact?.phone || '+254 700 000 000';

  return (
    <section id="cyber-services" className="scroll-mt-20 py-20 sm:py-24 bg-stone-900 dark:bg-black text-white relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Cyber and Digital solutions */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Support, Cyber &amp; Digital Assistance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white">
            Cyber and Digital solutions
          </h2>
          <p className="text-stone-300 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
            Josam Technologies is your dedicated technology partner ready to <strong className="text-white font-semibold">help in any tech issues</strong>. Whether you have a malfunctioning computer or laptop, need software or antivirus installed, require account recovery, or need seamless execution across official portals (KRA, HELB, eCitizen, NTSA) and professional document formatting — our team is here with fast, reliable, and hands-on solutions.
          </p>
        </div>

        {/* Quick Capabilities: Any Tech Issue Coverage */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">PC &amp; Laptop Support</span>
            <span className="text-[10px] text-stone-400">Slowdowns, malware &amp; OS setup</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">KRA &amp; Taxes</span>
            <span className="text-[10px] text-stone-400">Returns, PINs &amp; TCC compliance</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">HELB Student Portals</span>
            <span className="text-[10px] text-stone-400">Loans, disbursement &amp; clearance</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">eCitizen &amp; NTSA</span>
            <span className="text-[10px] text-stone-400">CR12, business &amp; licence renewals</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">Account Security</span>
            <span className="text-[10px] text-stone-400">Password resets &amp; 2FA recovery</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/60 dark:bg-zinc-900/60 border border-stone-700/60 dark:border-zinc-800 flex flex-col gap-1.5 items-center text-center">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-[11px]">Any Tech Challenge</span>
            <span className="text-[10px] text-stone-400">Wi-Fi, printer errors &amp; custom fixes</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE ASSISTANCE DESK: SELECT HELP / ASK ANYTHING / GUIDANCE */}
        {/* ------------------------------------------------------------- */}
        <div
          id="cyber-assistance-desk"
          className="rounded-3xl bg-gradient-to-b from-stone-800/90 to-stone-900/95 dark:from-zinc-900/90 dark:to-zinc-950/95 border border-stone-700/80 dark:border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Assistance Header */}
          <div className="max-w-3xl mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Wrench className="w-3.5 h-3.5" />
              <span>Interactive Assistance &amp; Tech Help Desk</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Outfit'] text-white">
              What kind of assistance do you need?
            </h3>
            <p className="text-stone-300 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Anyone can select or describe what kind of assistance they need — it can be anything! Ask a question, request step-by-step guidance, have us fix an issue hands-on, or request urgent same-day turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Category Selector & Intent Selection */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Step 1: Select Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">
                  1. Select Area of Assistance
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {ASSISTANCE_CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setErrorMessage(null);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600/20 border-orange-500 text-white shadow-md ring-1 ring-orange-500/30'
                            : 'bg-stone-800/60 dark:bg-zinc-900/60 border-stone-700/70 dark:border-zinc-800 text-stone-300 dark:text-zinc-400 hover:bg-stone-800 hover:border-stone-600 hover:text-white'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-stone-700 dark:bg-zinc-800 text-stone-300 dark:text-zinc-400'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs sm:text-sm font-semibold text-white truncate">
                              {cat.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 dark:text-zinc-500 truncate mt-0.5">
                            {cat.badge}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Intent */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2.5">
                  2. What type of help do you prefer?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASSISTANCE_INTENTS.map((intent) => {
                    const IntentIcon = intent.icon;
                    const isSelected = selectedIntent === intent.id;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => setSelectedIntent(intent.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500/20 border-orange-400 text-white'
                            : 'bg-stone-800/40 dark:bg-zinc-900/40 border-stone-700/60 dark:border-zinc-800 text-stone-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <IntentIcon
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-orange-400' : 'text-stone-400'
                            }`}
                          />
                          <span className="text-xs font-semibold text-white">
                            {intent.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 dark:text-zinc-500 line-clamp-1">
                          {intent.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Question Form & Instant Action Desk */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-stone-900/90 dark:bg-zinc-950/90 border border-stone-700 dark:border-zinc-800 p-6 sm:p-8 shadow-inner space-y-6">
                
                {/* Active Context Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-800/80 dark:bg-zinc-900/80 border border-stone-700/80 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <activeCategory.icon className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{activeCategory.name}</span>
                      <span className="text-stone-400 ml-1.5 text-[11px]">({activeIntent.label})</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Direct Support Line
                  </span>
                </div>

                {/* Suggested Prompts / Instant Question Inspiration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
                      <span>Suggested questions &amp; common requests (click to use):</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPrompt(prompt)}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-stone-700 dark:border-zinc-700 text-stone-200 hover:text-white transition-colors text-left cursor-pointer"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submission Success State */}
                {submissionSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-800 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <div className="p-2 rounded-full bg-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-['Outfit']">
                          Assistance Request Received!
                        </h4>
                        <p className="text-xs text-emerald-300">
                          Josam Technologies digital specialists will review your question and respond promptly.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/60 text-xs space-y-1 text-stone-300">
                      <div><strong className="text-white">Topic:</strong> {activeCategory.name}</div>
                      <div><strong className="text-white">Your Question:</strong> "{questionText}"</div>
                      <div><strong className="text-white">Contact Target:</strong> {email} {phone ? `| ${phone}` : ''}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleWhatsAppDirect}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp For Immediate Reply</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Ask Another Question</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    
                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Question / Guidance / Anything text area */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
                          3. Describe what you need, ask a question, or seek guidance *
                        </label>
                        <span className="text-[11px] text-stone-400">
                          Can be anything
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={questionText}
                        onChange={(e) => {
                          setQuestionText(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder={`e.g. Can you guide me on what is needed for ${activeCategory.name}? Or describe your situation, ask about fees, portal errors, or express service...`}
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 dark:border-zinc-800 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-y"
                      />
                    </div>

                    {/* User Contact Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="+254 700 000 000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="client@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Preferred Response Method */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-400 font-medium">
                          Reply via:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPreferredContact(method)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                                preferredContact === method
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-stone-800 text-stone-400 hover:text-white'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] text-stone-400">
                        Fast turnaround across all channels
                      </span>
                    </div>

                    {/* Submission Action Buttons */}
                    <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      
                      {/* Primary Web Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Request &amp; Get Guidance</span>
                          </>
                        )}
                      </button>

                      {/* Immediate WhatsApp Chat with pre-populated message */}
                      <button
                        type="button"
                        onClick={handleWhatsAppDirect}
                        className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                        title="Chat directly on WhatsApp with our team"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ask on WhatsApp</span>
                      </button>

                    </div>

                  </form>
                )}

                {/* Direct Hotline Footer strip */}
                <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-stone-300">
                      <Phone className="w-3.5 h-3.5 text-orange-400" />
                      <span>Direct Hotline:</span>
                      <a href={`tel:${safePhone.replace(/\s+/g, '')}`} className="font-mono text-white hover:underline">
                        {safePhone}
                      </a>
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="flex items-center gap-1.5 text-stone-300">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp:</span>
                      <span className="font-mono text-white">{safeWhatsapp}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInquire('Cyber and Digital Solutions')}
                    className="text-[11px] text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
                  >
                    Open Comprehensive Project Inquiry Form
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

