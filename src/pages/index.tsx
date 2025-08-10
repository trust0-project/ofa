"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Lock,
  ClipboardCheck,
  DownloadCloud,
  ShieldCheck,
  Landmark,
  LinkIcon,
  BookOpen,
  CreditCard,
  Activity,
  CopyCheck,
  Settings2,
  ArrowRight,
  Github,
  Heart,
  Shield,
  Wallet,
  CheckCircle2,
  Globe2,
} from "lucide-react"


import LOGO from "../../public/logos/ofa-dark.svg"
import LOGOSmall from "../../public/logos/logo.png"
import IdentusLogo from "../../public/identus-navbar-light.png"

// Note: In the Next.js App Router, you should handle <head> elements
// using the Metadata API in a Server Component, like your app/layout.tsx file.
// Client components like this one cannot export metadata.

export default function Home() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks: {name: string, href: string}[] = [
    { name: "What you can do", href: "#what-you-can-do" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Why OFA", href: "#benefits" },
    { name: "Tech", href: "#use-cases" },
    { name: "FAQ", href: "#faq" },
  ]

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-200">
        {/* Header */}
        <header
          className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <Image src={LOGOSmall} alt="OFA Logo" width={0} height={30} />
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                {navLinks.map(link => (
                  <a key={link.name} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="hidden md:flex items-center">
                <button
                  type="button"
                  onClick={() => router.push("/app")}
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white bg-gradient-to-r from-teal-500 to-green-500 rounded-full"
                >
                  <span className="mr-2">Open</span>
                  <Image src={LOGO} alt="OFA" width={0} height={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-col items-center">
          {/* Hero section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 w-max">
                  <Shield className="w-3.5 h-3.5" /> Offline‑first, runs entirely in your browser
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                  OFA - Offline-First Digital credentials for Cardano
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  Create DIDs, issue and verify W3C credentials, and publish identifiers on‑chain using any CIP‑30 Cardano wallet.
                  No servers. No middlemen. You own the keys and the data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/app")}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white bg-gradient-to-r from-teal-500 to-green-600 hover:opacity-95 transition"
                  >
                    Open OFA <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    How it works
                  </a>
                </div>
              </div>
              <div className="relative w-full h-96 lg:h-[450px]">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-blob" />
                  <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                  <div className="absolute top-10 right-10 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl animate-blob animation-delay-4000" />
                </div>
                <div className="relative h-full w-full bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">Built with</h3>
                    <div className="inline-block p-4 rounded-2xl shadow-lg">
                      <Image src={IdentusLogo} alt="Identus" width={0} height={120} />
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">and secured by the Cardano blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What you can do */}
          <section id="what-you-can-do" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">What you can do with OFA</h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Everything you need to build decentralized identity experiences on Cardano.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
                icon: Globe2,
                title: 'Create DIDs',
                description: 'Generate and manage Prism and Peer DIDs locally, fully under your control.'
              }, {
                icon: ClipboardCheck,
                title: 'Issue Credentials',
                description: 'Issue W3C credentials using open standards with no external services.'
              }, {
                icon: ShieldCheck,
                title: 'Verify Credentials',
                description: 'Verify presentations offline with DIDComm V2 secure messaging.'
              }, {
                icon: Wallet,
                title: 'Publish On‑Chain',
                description: 'Publish DIDs on Cardano using any CIP‑30 compatible wallet.'
              }].map((card) => (
                <div key={card.title} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features section */}
          <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Secure - OnChain - Private
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Your identity, your keys, your data — owned and controlled by you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lock,
                  title: "Where are keys stored?",
                  description:
                    "Your data is encrypted with your password and stored locally in your browser or desktop app. Losing your password means permanent loss of access.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Offline first? wait, what?",
                  description:
                    "No heavy deployments needed. Publish DIDs on Cardano and enable trustless verification of your signatures and the credentials you issue.",
                },
                {
                  icon: DownloadCloud,
                  title: "Why Cardano? Why DIDs",
                  description:
                    "DIDs enable decentralized identity without central control. Cardano provides secure, sustainable infrastructure accessible to anyone with a Web3 wallet.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">How it works</h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Three simple steps to own your identity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Wallet, title: 'Connect your wallet', description: 'Use any CIP‑30 compatible Cardano wallet. Your private keys never leave your device.' },
                { icon: Globe2, title: 'Create your DID', description: 'Generate Prism or Peer DIDs locally and optionally publish on‑chain.' },
                { icon: CheckCircle2, title: 'Issue or verify', description: 'Exchange credentials over DIDComm V2 using open standards and best‑in‑class crypto.' },
              ].map((step) => (
                <div key={step.title} className="bg-white dark:bg-[#0B0B0B] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-gray-100 dark:bg-gray-900">
                    <step.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits section */}
          <section id="benefits" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Why Choose Offline-First Identity?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Experience unparalleled security, privacy, and control over your digital identity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {[
                {
                  icon: Landmark,
                  title: "Zero Infrastructure Required",
                  description:
                    "Deploy identity solutions without servers, databases, or cloud dependencies. Everything runs locally in your browser.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trustless Verification",
                  description:
                    "DIDs published on-chain enable fully decentralized verification without trusting any intermediary service or authority.",
                },
                {
                  icon: CopyCheck,
                  title: "Complete Data Ownership",
                  description:
                    "Your identity data is stored locally and password-protected. No third party can access, control, or monetize your information.",
                },
                {
                  icon: LinkIcon,
                  title: "Cardano Integration",
                  description:
                    "Leverage Cardano's secure and sustainable blockchain infrastructure with seamless CIP-30 wallet connectivity.",
                },
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases section */}
          <section id="use-cases" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Perfect for the Cardano Ecosystem</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Build the next generation of dApps with user-centric identity at the core.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, title: "Uses DIDComm V2" },
                { icon: CreditCard, title: "W3C + DIF Standards" },
                { icon: Activity, title: "JWT, SDJWT, Anoncreds" },
                { icon: CopyCheck, title: "CIP-30 Compatible" },
                { icon: LinkIcon, title: "Secure encrypted storage" },
                { icon: Settings2, title: "Distributed Mediators" },
              ].map((useCase) => (
                <div
                  key={useCase.title}
                  className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
                    <useCase.icon className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-semibold">{useCase.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">FAQ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: 'Does OFA require any server?', a: 'No. It runs locally in your browser or desktop app. Optional on‑chain DID publication uses your wallet.' },
                { q: 'Where are my keys stored?', a: 'Encrypted with your password and stored locally. We never see or transmit your keys.' },
                { q: 'What wallets are supported?', a: 'Any CIP‑30 compatible Cardano wallet.' },
                { q: 'What if I lose my password?', a: 'We cannot recover it. Without your password you will lose access to locally stored data.' },
              ].map((item) => (
                <div key={item.q} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="relative bg-gradient-to-br from-teal-500 to-green-600 text-white rounded-3xl p-10 md:p-16 text-center overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full"></div>
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build infrastructure‑free?</h2>
                  <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-green-100">
                    Start building decentralized identity on Cardano. Connect your CIP‑30 wallet and get started in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                      onClick={() => window.open("https://trust0.id", "_blank")}
                      className="inline-flex items-center justify-center bg-white text-teal-600 hover:bg-green-50 rounded-full px-6 py-3 font-medium transition-colors"
                    >
                      Made by Trust0 <Heart className="w-4 h-4 ml-2 fill-current" />
                    </button>
                  <button
                    type="button"
                      onClick={() => window.open("https://github.com/trust0-project/identus-ofa", "_blank")}
                      className="inline-flex items-center justify-center border border-white/50 hover:bg-white/10 rounded-full px-6 py-3 font-medium transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" /> View on GitHub
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <Image src={LOGO || "/placeholder.svg"} alt="Identus Logo" width={108} height={32} />
              </div>
              <div className="flex gap-8">
                {/* {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))} */}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Powered by</span>
                <Image src={IdentusLogo} alt="Identus Logo" width={0} height={30} />
              </div>
            </div>
          </div>
        </footer>
      </div>
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}
