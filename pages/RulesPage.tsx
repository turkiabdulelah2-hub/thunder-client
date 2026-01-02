import { SEO } from "@/components/SEO/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Minus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRuleStore } from "@/stores/ruleStore";

export default function RulesPage() {
    const { rules, loading, error, fetchRules } = useRuleStore();
    const [openRule, setOpenRule] = useState<string | null>(null);

    useEffect(() => {
        fetchRules(true); // Fetch only active rules
    }, [fetchRules]);

    const toggleRule = (ruleId: string) => {
        setOpenRule(openRule === ruleId ? null : ruleId);
    };

    return (
        <>
            <SEO
                title="القوانين"
                description="قوانين وإرشادات مجتمع ريسبكت. يرجى الاطلاع عليها لضمان تجربة لعب عادلة وممتعة للجميع."
                keywords={["قوانين", "إرشادات", "رول بلاي", "مخالفات", "ريسبكت", "قواعد السيرفر"]}
                url="/rules"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "الرئيسية",
                            item: "https://respect-cfw.com"
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "القوانين",
                            item: "https://respect-cfw.com/rules"
                        }
                    ]
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Fixed Background */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: 'url(/images/bg-4.png)' }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className="container relative z-20 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            القوانين
                        </h1>

                        <Breadcrumb className="mb-6 flex justify-center">
                            <BreadcrumbList className="text-white/90">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="text-white/70 hover:text-white text-lg">
                                        الرئيسية
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronLeft className="text-white/70" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white text-lg font-semibold">
                                        القوانين
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </motion.div>
                </div>
            </section>

            {/* Rules Accordion Section */}
            <section className="py-20 bg-[#120033]">
                <div className="container max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            قوانين سيرفر ريسبكت
                        </h2>
                        <p className="text-white/70 text-lg">
                            يرجى قراءة القوانين بعناية والالتزام بها لضمان تجربة لعب ممتعة للجميع
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 text-xl">{error}</p>
                        </div>
                    ) : rules.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/70 text-xl">لا توجد قوانين حالياً</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#19093a] p-8"
                        >
                            <div className="space-y-4">
                                {rules.map((rule, index) => (
                                    <motion.div
                                        key={rule._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#2a174b] border-0 border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-all"
                                    >
                                        <button
                                            onClick={() => toggleRule(rule._id)}
                                            className="w-full flex items-center justify-between gap-4 px-6 py-6 text-right outline-none"
                                        >
                                            <span className="text-white hover:text-primary text-lg font-bold flex-1 transition-colors text-right">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-gray-300 -mt-1 w-4 h-4 rounded-full"></div>
                                                    <p>{rule.title}</p>
                                                </div>
                                            </span>
                                            <motion.div
                                                animate={{ rotate: openRule === rule._id ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {openRule === rule._id ? (
                                                    <Minus className="text-primary w-5 h-5" />
                                                ) : (
                                                    <Plus className="text-white/70 w-5 h-5" />
                                                )}
                                            </motion.div>
                                        </button>

                                        <AnimatePresence>
                                            {openRule === rule._id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 text-white/80 text-right leading-relaxed">
                                                        {rule.description}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </>
    );
}
