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
    { name: "Features", href: "#features" },
    { name: "Benefits", href: "#benefits" },
    { name: "Use Cases", href: "#use-cases" },
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
            <Image src={LOGOSmall} alt="Identus Logo" width={0} height={30} />
               </div>
              
              <div className="hidden md:flex items-center">
               <button
                  onClick={() => router.push("/app")}
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white bg-gradient-to-r from-teal-500 to-green-500 rounded-full"
                >
                  <span>Open&nbsp;</span>
                  <Image src={LOGO} alt="Identus Logo" width={0} height={20} />
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
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                  OFA
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  Is a digital identity agent on top of Cardano and Hyperledger Identus that runs entirely offline, in your browser or desktop application.
                  <br />
                  <br />
                  Entire Digital Identity ecosystem without infrastructure hussle, and no middleman that you can run, control, for free and forever!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
  
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
                  <h3 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Built with</h3>

                    <div className="inline-block p-4 rounded-2xl shadow-lg">
                      <Image src={IdentusLogo} alt="Identus Logo" width={0} height={120} />
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">+Secured by Cardano blockchain.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Secure - OnChain - Private
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Your data is your data, and you own it.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lock,
                  title: "Where are keys stored?",
                  description:
                    "Encrypted using the password you defined the data will be stored in your browser or desktop application. Loosing password will cause permanent loss of data.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Offline first? wait, what?",
                  description:
                    "You no longer need heavy deployments. Thanks to Cardano Blockchain, you can issue your DIDs onChain and verifiers will always be able to verify your signatures or the ones of credentials you issued.",
                },
                {
                  icon: DownloadCloud,
                  title: "Why Cardano? Why DIDs",
                  description:
                    "DIDs allow you to build decentralised identity applications without relying on any centralised parties, making it fully decentralized and accesible to everyone with access to a Web3 wallet.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
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
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6">
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
              ].map((useCase, i) => (
                <div
                  key={i}
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

          {/* CTA Section */}
          <section className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="relative bg-gradient-to-br from-teal-500 to-green-600 text-white rounded-3xl p-10 md:p-16 text-center overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full"></div>
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Infrastructure-Free?</h2>
                  <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-green-100">
                    Start building decentralized identity applications on Cardano. Connect your CIP-30 wallet and get
                    started in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => window.open("https://trust0.id", "_blank")}
                      className="inline-flex items-center justify-center bg-white text-teal-600 hover:bg-green-50 rounded-full px-6 py-3 font-medium transition-colors"
                    >
                      Made by Trust0 <Heart className="w-4 h-4 ml-2 fill-current" />
                    </button>
                    <button
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
