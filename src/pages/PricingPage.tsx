import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, HelpCircle, Zap } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
}

const plans = [
    {
        name: "Starter",
        description: "Perfect for small teams getting started with modern training.",
        monthlyPrice: 10,
        annualPrice: 8,
        features: [
            "Up to 50 users",
            "Basic course library",
            "Standard reporting",
            "Email support",
            "5 custom courses",
        ],
        cta: "Start Free Trial",
        variant: "outline" as const,
        popular: false,
    },
    {
        name: "Growth",
        description: "For growing companies with custom training needs.",
        monthlyPrice: 19,
        annualPrice: 15,
        features: [
            "Up to 250 users",
            "Custom content upload",
            "Advanced analytics",
            "AI Tutor access",
            "Priority support",
            "SCORM import/export",
            "Team leaderboards",
        ],
        cta: "Get Started",
        variant: "default" as const,
        popular: true,
    },
    {
        name: "Enterprise",
        description: "For large organizations needing full control & compliance.",
        monthlyPrice: null,
        annualPrice: null,
        features: [
            "Unlimited users",
            "Dedicated success manager",
            "SSO & API access",
            "Custom integrations",
            "SLA guarantee",
            "White-label option",
            "Advanced security & audit logs",
        ],
        cta: "Contact Sales",
        variant: "outline" as const,
        popular: false,
    },
]

const faqs = [
    {
        q: "Can I switch plans later?",
        a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes! Every plan comes with a 14-day free trial. No credit card required to start.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, ACH bank transfers, and can arrange invoicing for Enterprise customers.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
    },
    {
        q: "Do you offer discounts for non-profits or education?",
        a: "Yes, we offer special pricing for non-profits and educational institutions. Contact our sales team for details.",
    },
    {
        q: "What kind of support is included?",
        a: "All plans include email support. Growth plans get priority support, and Enterprise customers receive a dedicated success manager.",
    },
]

export default function PricingPage() {
    const [annual, setAnnual] = useState(true)

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-zinc-50 pt-32 pb-20">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            <Zap className="w-3 h-3 mr-1" /> Simple Pricing
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
                            Plans that <span className="text-indigo-600">scale with you.</span>
                        </h1>
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-10">
                            Start free, upgrade when you're ready. No hidden fees, no surprises. Just great training tools for your team.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-4 mb-12"
                    >
                        <span className={cn("text-sm font-medium", !annual ? "text-zinc-900" : "text-zinc-500")}>Monthly</span>
                        <Switch checked={annual} onCheckedChange={setAnnual} />
                        <span className={cn("text-sm font-medium", annual ? "text-zinc-900" : "text-zinc-500")}>
                            Annually <Badge variant="secondary" className="ml-1 text-[10px] bg-emerald-100 text-emerald-700">Save 20%</Badge>
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 bg-white -mt-10 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                            >
                                <Card className={cn(
                                    "h-full flex flex-col",
                                    plan.popular
                                        ? "border-indigo-600 shadow-lg shadow-indigo-100 relative"
                                        : "border-zinc-200 shadow-sm"
                                )}>
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-none">Most Popular</Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>{plan.description}</CardDescription>
                                        <div className="mt-4">
                                            {plan.monthlyPrice !== null ? (
                                                <>
                                                    <span className="text-4xl font-bold">${annual ? plan.annualPrice : plan.monthlyPrice}</span>
                                                    <span className="text-zinc-500">/user/mo</span>
                                                </>
                                            ) : (
                                                <span className="text-4xl font-bold">Custom</span>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm text-zinc-600">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        {plan.popular ? (
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                                                <Link to="/login">{plan.cta}</Link>
                                            </Button>
                                        ) : (
                                            <Button className="w-full" variant={plan.variant}>{plan.cta}</Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-20 bg-zinc-50 border-t border-zinc-200">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Compare plans</h2>
                        <p className="text-lg text-zinc-600">See what's included in each plan at a glance.</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-200">
                                    <th className="text-left py-4 pr-4 font-semibold text-zinc-900">Feature</th>
                                    <th className="text-center py-4 px-4 font-semibold text-zinc-900">Starter</th>
                                    <th className="text-center py-4 px-4 font-semibold text-indigo-700 bg-indigo-50/50 rounded-t-lg">Growth</th>
                                    <th className="text-center py-4 px-4 font-semibold text-zinc-900">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-600">
                                {[
                                    ["Users", "Up to 50", "Up to 250", "Unlimited"],
                                    ["Course Library", "Basic", "Full", "Full + Custom"],
                                    ["Custom Content", "5 courses", "Unlimited", "Unlimited"],
                                    ["AI Tutor", "—", "✓", "✓"],
                                    ["Analytics", "Basic", "Advanced", "Advanced + API"],
                                    ["Gamification", "Basic", "Full", "Full + Custom"],
                                    ["SSO / SAML", "—", "—", "✓"],
                                    ["API Access", "—", "—", "✓"],
                                    ["Dedicated Manager", "—", "—", "✓"],
                                    ["SLA Guarantee", "—", "—", "✓"],
                                    ["Support", "Email", "Priority", "24/7 Dedicated"],
                                ].map(([feature, starter, growth, enterprise], i) => (
                                    <motion.tr
                                        key={feature}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                                    >
                                        <td className="py-3 pr-4 font-medium text-zinc-900">{feature}</td>
                                        <td className="py-3 px-4 text-center">{starter}</td>
                                        <td className="py-3 px-4 text-center bg-indigo-50/30 font-medium text-indigo-700">{growth}</td>
                                        <td className="py-3 px-4 text-center">{enterprise}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Frequently asked questions</h2>
                        <p className="text-lg text-zinc-600">Everything you need to know about our pricing.</p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto grid gap-6">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={faq.q}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 hover:border-zinc-200 transition-colors"
                            >
                                <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                                </h3>
                                <p className="text-sm text-zinc-600 leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-zinc-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your team's training?</h2>
                        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
                            Start your 14-day free trial today. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-xl" asChild>
                                <Link to="/login">Start Free Trial</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                Contact Sales
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
