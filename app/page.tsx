"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
export default function OBDTechLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "banco-digital",
        "pagamentos",
        "apis",
        "cartoes",
        "credito",
        "contato",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const FloatingElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-20 h-20 bg-app-accent/10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-app-bg-light/20 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-app-accent/10 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-10 w-18 h-18 bg-app-bg-light/20 rounded-full animate-bounce delay-700"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-app-accent/10 rounded-full animate-pulse delay-300"></div>
      <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-app-bg-light/20 rounded-full animate-bounce delay-1200"></div>
    </div>
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          company: "",
          interest: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isServiceUnavailable, setIsServiceUnavailable] = useState(true);

  const formRef = useRef(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
      .sendForm(
        "binbank_sender", // <- ID do serviço de email
        "template_39gj11f", // <- ID do template
        formRef.current!, // <- Referência do form
        "TtxFsqh9Eisew94tt" // <- Sua public key do emailjs
      )
      .then(() => {
        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          interest: "",
          message: "",
        });
      })
      .catch(() => {
        setIsSubmitting(false);
        setSubmitStatus("error");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg-dark via-app-bg-medium to-black text-app-text-primary font-['Poppins',sans-serif] relative">
      <FloatingElements />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-app-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo-1.png"
                alt="BIN Bank"
                width={200}
                height={80}
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Início" },
                { id: "banco-digital", label: "Banco Digital" },
                { id: "pagamentos", label: "Pagamentos" },
                { id: "apis", label: "APIs" },
                { id: "cartoes", label: "Cartões" },
                { id: "credito", label: "Crédito" },
                { id: "contato", label: "Contato" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-all duration-300 hover:text-app-text-secondary ${
                    activeSection === item.id
                      ? "text-app-text-secondary border-b-2 border-app-accent"
                      : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                  }`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mb-4 p-4">
              {[
                { id: "home", label: "Início" },
                { id: "banco-digital", label: "Banco Digital" },
                { id: "pagamentos", label: "Pagamentos" },
                { id: "apis", label: "APIs" },
                { id: "cartoes", label: "Cartões" },
                { id: "credito", label: "Crédito" },
                { id: "contato", label: "Contato" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 hover:text-app-text-secondary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-8 rounded-2xl p-8 bg-black/[10%] backdrop-blur-sm shadow-md mt-auto">
            <img
              src="/logo-1.png"
              className="w-72 md:w-[400px] drop-shadow-md"
            />
          </div>
          <div className="animate-fade-in-up">
            <p className="text-xl md:text-2xl mb-8 text-app-text-secondary max-w-3xl mx-auto">
              Sistemas e tecnologia Financeira completa para o seu negócio
            </p>
            <p className="text-lg mb-12 text-app-text-tertiary max-w-4xl mx-auto">
              Transforme seu negócio com soluções financeiras personalizadas,
              seguras e escaláveis. Nós cuidamos da tecnologia para você focar
              no crescimento.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-app-text-primary mb-2">
                  99.9%
                </div>
                <div className="text-app-text-tertiary text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-app-text-primary mb-2">
                  100%
                </div>
                <div className="text-app-text-tertiary text-sm">Whitelabel</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-app-text-primary mb-2">
                  24/7
                </div>
                <div className="text-app-text-tertiary text-sm">Suporte</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-app-text-primary mb-2">
                  API
                </div>
                <div className="text-app-text-tertiary text-sm">Completa</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("contato")}
                className="bg-gradient-to-r from-app-bg-light to-app-bg-lighter hover:from-app-bg-lighter hover:to-app-accent px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Começar Agora
              </button>
              <button
                onClick={() => scrollToSection("banco-digital")}
                className="border-2 border-app-accent hover:bg-app-accent/20 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Saiba Mais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banco Digital Section */}
      <section id="banco-digital" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              Banco Digital Completo
            </h2>
            <p className="text-xl text-app-text-secondary max-w-3xl mx-auto">
              Quer se tornar uma fintech? Com a BIN Bank, é possível! Nós
              cuidamos da burocracia e da infraestrutura tecnológica enquanto
              você foca no crescimento do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                Conta Digital Completa
              </h3>
              <p className="text-app-text-tertiary mb-4">
                Ofereça contas digitais com todas as funcionalidades bancárias
                tradicionais
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Abertura de conta 100% digital</li>
                <li>• PIX integrado</li>
                <li>• TED e DOC</li>
                <li>• Extrato em tempo real</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                Banco Whitelabel
              </h3>
              <p className="text-app-text-tertiary mb-4">
                Feito sob medida às suas preferências!
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Completamente personalizado</li>
                <li>• Seguimos o seu Branding</li>
                <li>• Flexibilidade para atender as suas necessidades</li>
                <li>• Foco em escalabilidade</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                Sociedade de Crédito Direto
              </h3>
              <p className="text-app-text-tertiary mb-4">
                Crédito sem Bancos tradicionais, com total compliance e
                segurança
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Crédito por sociedade ou direto</li>
                <li>• Operação Digital</li>
                <li>• Taxas de Juros mais competitivas para o mercado</li>
                <li>• Regulamentado pelo Banco Central</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-app-bg-medium/30 to-app-bg-light/30 p-8 rounded-2xl backdrop-blur-sm border border-app-border/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-app-text-primary">
                  Por que escolher nossa solução bancária?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-app-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Time to Market Reduzido
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Lance sua fintech rapidamente, sem enrolas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-app-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Custos Operacionais Baixos
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Infraestrutura compartilhada e otimizada
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-app-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Escalabilidade Garantida
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Cresça sem se preocupar com limitações técnicas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-app-bg-light rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">🏷️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        100% Whitelabel
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Sua marca em todos os pontos de contato
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <div className="text-3xl font-bold text-app-text-primary mb-2">
                  Economia de até 70%
                </div>
                <div className="text-app-text-tertiary">
                  em custos de desenvolvimento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pagamentos Section */}
      <section id="pagamentos" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              BIN Bank Payments
            </h2>
            <p className="text-xl text-app-text-secondary max-w-3xl mx-auto">
              Personalize pagamentos, escale seu negócio e amplie receitas sem
              preocupações regulatórias — cuidamos de tudo, do compliance às
              integrações via API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">💳</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                100%
              </div>
              <div className="text-app-text-tertiary text-sm">Whitelabel</div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                {"<1s"}
              </div>
              <div className="text-app-text-tertiary text-sm">
                Tempo de Resposta
              </div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">🔒</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                99.99%
              </div>
              <div className="text-app-text-tertiary text-sm">
                Taxa de Aprovação
              </div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">📈</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                Marca
              </div>
              <div className="text-app-text-tertiary text-sm">
                Sua Identidade
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-app-text-primary">
                Soluções de Pagamento Completas
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🌐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Gateway Unificado
                    </h4>
                    <p className="text-app-text-tertiary">
                      Uma única integração para todos os meios de pagamento:
                      cartões, PIX, boleto, carteiras digitais e muito mais.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Antifraude Inteligente
                    </h4>
                    <p className="text-app-text-tertiary">
                      Machine learning avançado para detectar e prevenir fraudes
                      em tempo real, protegendo seu negócio.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Taxas Competitivas
                    </h4>
                    <p className="text-app-text-tertiary">
                      As menores taxas do mercado com transparência total. Sem
                      taxas ocultas ou surpresas no final do mês.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-8 rounded-2xl backdrop-blur-sm border border-app-border/50">
              <h4 className="text-xl font-semibold mb-4 text-app-text-primary">
                Meios de Pagamento Suportados
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Cartão de Crédito
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Cartão de Débito
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  PIX
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Boleto Bancário
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Apple Pay
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Google Pay
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  PayPal
                </div>
                <div className="flex items-center text-app-text-secondary">
                  <span className="w-2 h-2 bg-app-accent rounded-full mr-2"></span>
                  Mercado Pago
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APIs Section */}
      <section id="apis" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              Integrações de APIs
            </h2>
            <p className="text-xl text-app-text-secondary max-w-3xl mx-auto">
              A BIN Bank oferece infraestrutura para seu crescimento em todos os
              canais: físico e digital. APIs robustas e documentação completa
              para desenvolvedores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                APIs RESTful
              </h3>
              <p className="text-app-text-tertiary mb-4">
                APIs modernas e padronizadas seguindo as melhores práticas do
                mercado
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Endpoints intuitivos</li>
                <li>• Versionamento adequado</li>
                <li>• Rate limiting inteligente</li>
                <li>• Webhooks em tempo real</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                Flexibilidade de negociação
              </h3>
              <p className="text-app-text-tertiary mb-4">
                Completamente baseado em multiadquirência
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Negociação direta com adquirentes</li>
                <li>• Aumenta o poder de barganha</li>
                <li>• Otimiza custos em negociação</li>
                <li>• Melhores taxas</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-3 text-app-text-primary">
                Gateway de Pagamentos
              </h3>
              <p className="text-app-text-tertiary mb-4">
                Integração para o seu e-commerce
              </p>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>• Facilidade de conexão</li>
                <li>• Integração para toda Web</li>
                <li>• Pagamentos com cartão</li>
                <li>• Pagamentos com Pix/Boleto</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-app-bg-medium/30 to-app-bg-light/30 p-8 rounded-2xl backdrop-blur-sm border border-app-border/30">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-app-text-primary">
                  Recursos Técnicos Avançados
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-app-bg-light rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Performance Otimizada
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Latência ultra-baixa com CDN global
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-app-bg-light rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">🔐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Segurança Avançada
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        OAuth 2.0, JWT e criptografia end-to-end
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-app-bg-light rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-app-text-primary">
                        Monitoramento 24/7
                      </h4>
                      <p className="text-app-text-tertiary text-sm">
                        Logs detalhados e alertas proativos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-app-text-primary">
                  Suporte ao Desenvolvedor
                </h3>
                <div className="space-y-4">
                  <div className="bg-app-bg-medium/50 p-4 rounded-lg transition-all duration-300 hover:bg-app-hover-bg/50 hover:scale-105 hover:shadow-lg">
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Backoffice Completo
                    </h4>
                    <p className="text-app-text-tertiary text-sm">
                      Painel administrativo completo e personalizável
                    </p>
                  </div>
                  <div className="bg-app-bg-medium/50 p-4 rounded-lg transition-all duration-300 hover:bg-app-hover-bg/50 hover:scale-105 hover:shadow-lg">
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Suporte Técnico
                    </h4>
                    <p className="text-app-text-tertiary text-sm">
                      Time especializado para dúvidas de integração
                    </p>
                  </div>
                  <div className="bg-app-bg-medium/50 p-4 rounded-lg transition-all duration-300 hover:bg-app-hover-bg/50 hover:scale-105 hover:shadow-lg">
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Suporte Técnico
                    </h4>
                    <p className="text-app-text-tertiary text-sm">
                      Time especializado para dúvidas de integração
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cartões Section */}
      <section id="cartoes" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              Cartões Personalizados
            </h2>
            <p className="text-xl text-app-text-secondary max-w-3xl mx-auto">
              Emita cartões físicos e virtuais com total personalização.
              Controle completo sobre limites, categorias e funcionalidades para
              atender às necessidades específicas do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-app-text-primary">
                Soluções Completas em Cartões
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">💎</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Cartões Físicos Premium
                    </h4>
                    <p className="text-app-text-tertiary">
                      Design exclusivo, materiais de alta qualidade e entrega
                      expressa em todo o Brasil.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Cartões Virtuais Instantâneos
                    </h4>
                    <p className="text-app-text-tertiary">
                      Criação imediata de cartões virtuais para compras online e
                      assinaturas digitais.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Completamente Whitelabel
                    </h4>
                    <p className="text-app-text-tertiary">
                      Cartões completamente personalizados com sua marca e
                      identidade visual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl mb-3">🚀</div>
                <div className="text-2xl font-bold text-app-text-primary mb-1">
                  Instantâneo
                </div>
                <div className="text-app-text-tertiary text-sm">
                  Emissão de cartões virtuais
                </div>
              </div>
              <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl mb-3">🌍</div>
                <div className="text-2xl font-bold text-app-text-primary mb-1">
                  Global
                </div>
                <div className="text-app-text-tertiary text-sm">
                  Aceito em todo mundo
                </div>
              </div>
              <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl mb-3">🔒</div>
                <div className="text-2xl font-bold text-app-text-primary mb-1">
                  Seguro
                </div>
                <div className="text-app-text-tertiary text-sm">
                  Tokenização avançada
                </div>
              </div>
              <div className="bg-gradient-to-br from-app-bg-medium/50 to-app-bg-dark/50 p-6 rounded-xl backdrop-blur-sm border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl mb-3">⚡</div>
                <div className="text-2xl font-bold text-app-text-primary mb-1">
                  Rápido
                </div>
                <div className="text-app-text-tertiary text-sm">
                  Processamento em tempo real
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-app-bg-medium/30 to-app-bg-light/30 p-8 rounded-2xl backdrop-blur-sm border border-app-border/30">
            <h3 className="text-2xl font-bold mb-6 text-app-text-primary text-center">
              Recursos Exclusivos
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-app-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-semibold text-app-text-primary mb-2">
                  Design Personalizado
                </h4>
                <p className="text-app-text-tertiary text-sm">
                  Crie cartões únicos com sua marca e identidade visual
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-app-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="font-semibold text-app-text-primary mb-2">
                  Gestão Simplificada
                </h4>
                <p className="text-app-text-tertiary text-sm">
                  Dashboard intuitivo para gerenciar todos os cartões
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-app-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h4 className="font-semibold text-app-text-primary mb-2">
                  100% Whitelabel
                </h4>
                <p className="text-app-text-tertiary text-sm">
                  Cartões com sua marca e identidade visual
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crédito Section */}
      <section id="credito" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              Soluções de Crédito Inteligentes
            </h2>
            <p className="text-xl text-app-text-secondary max-w-3xl mx-auto">
              Ofereça produtos de crédito inovadores com nossa plataforma
              completa. Análise de risco automatizada, aprovação instantânea e
              gestão inteligente de portfólio.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">🔄</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                Flexível
              </div>
              <div className="text-app-text-tertiary text-sm">
                Regras Personalizadas
              </div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                {"<30s"}
              </div>
              <div className="text-app-text-tertiary text-sm">Aprovação</div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">📈</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                85%
              </div>
              <div className="text-app-text-tertiary text-sm">
                Taxa de Aprovação
              </div>
            </div>
            <div className="text-center p-6 bg-app-bg-medium/30 rounded-xl border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="text-2xl font-bold text-app-text-primary mb-1">
                100%
              </div>
              <div className="text-app-text-tertiary text-sm">
                Personalização
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-app-text-primary">
                Produtos de Crédito Completos
              </h3>
              <div className="space-y-4">
                <div className="bg-app-bg-medium/30 p-4 rounded-lg border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                  <h4 className="font-semibold text-app-text-primary mb-2">
                    💳 Crédito Rotativo
                  </h4>
                  <p className="text-app-text-tertiary text-sm">
                    Limite pré-aprovado com juros competitivos e flexibilidade
                    total
                  </p>
                </div>
                <div className="bg-app-bg-medium/30 p-4 rounded-lg border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                  <h4 className="font-semibold text-app-text-primary mb-2">
                    🏠 Empréstimo Pessoal
                  </h4>
                  <p className="text-app-text-tertiary text-sm">
                    Valores altos com parcelas fixas e prazos estendidos
                  </p>
                </div>
                <div className="bg-app-bg-medium/30 p-4 rounded-lg border border-app-border/50 transition-all duration-300 hover:bg-app-hover-bg/40 hover:scale-105 hover:shadow-lg">
                  <h4 className="font-semibold text-app-text-primary mb-2">
                    🚗 Financiamento
                  </h4>
                  <p className="text-app-text-tertiary text-sm">
                    Financiamento de veículos e bens com garantia
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-app-text-primary">
                Tecnologia Avançada
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Regras Personalizáveis
                    </h4>
                    <p className="text-app-text-tertiary">
                      Configure suas próprias regras de aprovação de crédito de
                      acordo com seu modelo de negócio.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Análise Customizada
                    </h4>
                    <p className="text-app-text-tertiary">
                      Defina seus próprios critérios de análise e pontuação de
                      crédito.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-app-bg-light rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text-primary mb-2">
                      Monitoramento Contínuo
                    </h4>
                    <p className="text-app-text-tertiary">
                      Acompanhamento em tempo real do comportamento de
                      pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-app-text-secondary to-app-text-primary bg-clip-text text-transparent">
              Fale Conosco
            </h2>
            <p className="text-lg text-app-text-secondary mb-12">
              Pronto para transformar seu negócio? Entre em contato conosco e
              descubra como podemos ajudar você a crescer no mercado financeiro.
            </p>

            <form
              ref={formRef}
              onSubmit={handleEmailSubmit}
              className="bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-app-border/50"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="bg-app-bg-medium/50 border border-app-border/50 rounded-lg px-4 py-3 text-app-text-primary placeholder-app-text-tertiary focus:outline-none focus:border-app-accent transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Seu melhor email"
                  className="bg-app-bg-medium/50 border border-app-border/50 rounded-lg px-4 py-3 text-app-text-primary placeholder-app-text-tertiary focus:outline-none focus:border-app-accent transition-colors"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                  className="bg-app-bg-medium/50 border border-app-border/50 rounded-lg px-4 py-3 text-app-text-primary placeholder-app-text-tertiary focus:outline-none focus:border-app-accent transition-colors"
                />
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="bg-app-bg-medium/50 border border-app-border/50 rounded-lg px-4 py-3 text-app-text-primary focus:outline-none focus:border-app-accent transition-colors"
                  required
                >
                  <option value="">Área de interesse</option>
                  <option value="banco-digital">Banco Digital</option>
                  <option value="pagamentos">Gateway de Pagamentos</option>
                  <option value="apis">Integrações de API</option>
                  <option value="cartoes">Emissão de Cartões</option>
                  <option value="credito">Soluções de Crédito</option>
                  <option value="completo">Solução Completa</option>
                </select>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos mais sobre seu projeto e como podemos ajudar..."
                rows={4}
                className="w-full bg-app-bg-medium/50 border border-app-border/50 rounded-lg px-4 py-3 text-app-text-primary placeholder-app-text-tertiary focus:outline-none focus:border-app-accent transition-colors mb-6"
                required
              ></textarea>

              {submitStatus === "success" && (
                <div className="mb-4 p-4 bg-green-500/20 text-green-300 rounded-lg">
                  Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded-lg">
                  Ocorreu um erro ao enviar sua mensagem. Por favor, tente
                  novamente mais tarde.
                </div>
              )}

              <div className="relative">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-app-bg-light to-app-bg-lighter hover:from-app-bg-lighter hover:to-app-accent px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </div>
              <p className="text-app-text-tertiary text-sm mt-4">
                Ao enviar este formulário, você concorda com nossa política de
                privacidade e aceita receber comunicações da BIN Bank.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-app-border/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                src="/logo-1.png"
                alt="BIN Bank"
                width={160}
                height={80}
                className="h-10 w-auto mb-4 animate-fade-in-up"
              />
              <p className="text-app-text-tertiary text-sm">
                Transformando o futuro das soluções financeiras com tecnologia
                de ponta e inovação constante.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-app-text-primary mb-4">
                Soluções
              </h4>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>
                  <a
                    href="#banco-digital"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    Banco Digital
                  </a>
                </li>
                <li>
                  <a
                    href="#pagamentos"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    Gateway de Pagamentos
                  </a>
                </li>
                <li>
                  <a
                    href="#apis"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    APIs
                  </a>
                </li>
                <li>
                  <a
                    href="#cartoes"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    Cartões
                  </a>
                </li>
                <li>
                  <a
                    href="#credito"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    Crédito
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-app-text-primary mb-4">
                Suporte
              </h4>
              <ul className="space-y-2 text-sm text-app-text-tertiary">
                <li>
                  <a
                    href="#contato"
                    className="hover:text-app-text-primary transition-colors"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-app-border/50 pt-8 text-center">
            <p className="text-app-text-tertiary mb-4">
              © 2025 BIN Bank. Todos os direitos reservados.
            </p>
            <p className="text-app-text-tertiary text-sm">
              Soluções financeiras inovadoras para o futuro dos negócios.
            </p>
          </div>
          <a
            href="https://wa.me/+551151986345"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
            title="Fale conosco no WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </footer>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out;
        }
      `}</style>
    </div>
  );
}
