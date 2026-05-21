import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Heart, Sparkles } from "lucide-react";
import { Countdown } from "./Countdown";
import { Particles } from "./Particles";
import heroBg from "@/assets/hero-bg.jpg";
import pattern from "@/assets/pattern.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

const EVENT = {
  baby: "Wajdan Ullah Khan",
  parents: "Mr & Mrs Wajahat Ullah Khan",
  date: "Friday, 29 May 2026",
  time: "8:00 PM",
  inShaAllah: "In Sha Allah",
  venue: "Kohinoor Ballroom · Hall C, 3rd Floor",
  venueAddress: "916, Sector 11-B, North Karachi",
  phone: "+92 346 2772815",
  phoneTel: "+923462772815",
  target: new Date("2026-05-29T20:00:00+05:00"),
  rsvpBy: "22 May 2026",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
} as const;

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={`relative py-20 sm:py-28 px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <span className="h-px w-12 bg-gold/50" />
      <Sparkles className="size-4 text-gold" />
      <span className="h-px w-12 bg-gold/50" />
    </div>
  );
}

export function Invitation() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, var(--background) 80%)",
          }}
        />
        <Particles count={40} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="font-arabic text-2xl sm:text-3xl text-gold mb-4">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-6">
            With the blessings of Allah
          </div>
          <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {EVENT.parents}
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground italic max-w-xl mx-auto">
            cordially invite you to join the Aqiqah ceremony of their beloved son
          </p>
          <h1 className="font-display italic text-5xl sm:text-7xl md:text-8xl text-shimmer leading-[1.05] mt-6 pb-4">
            {EVENT.baby}
          </h1>
          <Ornament />
          <p className="font-display text-2xl sm:text-3xl text-gold mt-2">{EVENT.inShaAllah}</p>
          <p className="mt-4 font-display text-xl sm:text-2xl text-foreground">
            {EVENT.date} · {EVENT.time}
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16 text-xs text-muted-foreground tracking-widest"
          >
            ↓ SCROLL TO EXPLORE
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <Section className="max-w-3xl mx-auto text-center">
        <p className="font-arabic text-xl text-gold">العقيقة</p>
        <h2 className="text-4xl sm:text-5xl font-display italic mt-2">About Aqiqah</h2>
        <Ornament />
        <p className="text-muted-foreground leading-relaxed text-lg">
          Aqiqah is a cherished Islamic tradition performed in gratitude to Allah for the blessing
          of a newborn child. It is a moment of prayer, family, and joy — a time when loved ones
          gather to welcome a new soul into the ummah with blessings, kindness, and shared meals.
        </p>
      </Section>

      {/* DETAILS / TIMELINE */}
      <Section id="details" className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-display italic">Event Details</h2>
          <Ornament />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {[
            { icon: Calendar, label: "Date", value: EVENT.date },
            { icon: Clock, label: "Time", value: EVENT.time },
            {
              icon: MapPin,
              label: "Venue",
              value: EVENT.venue,
              sub: EVENT.venueAddress,
            },
          ].map((d) => (
            <div
              key={d.label}
              className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-6 shadow-soft text-center"
            >
              <d.icon className="size-6 text-gold mx-auto mb-3" />
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {d.label}
              </div>
              <div className="mt-2 font-display text-lg text-foreground">{d.value}</div>
              {"sub" in d && d.sub && (
                <div className="mt-1 text-sm text-muted-foreground">{d.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-16 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
          {[
            { t: "8:00 PM", title: "Guest Arrival & Welcome" },
            { t: "8:15 PM", title: "Recitation of the Holy Qur'an" },
            { t: "8:30 PM", title: "Aqiqah Ceremony & Tahneek" },
            { t: "9:00 PM", title: "Du'a & Blessings" },
            { t: "9:30 PM", title: "Dinner & Celebration" },
          ].map((it, i) => (
            <div key={it.t} className={`relative grid grid-cols-2 gap-6 py-6 ${i % 2 ? "" : ""}`}>
              <div className={`text-right ${i % 2 ? "order-2 text-left" : ""}`}>
                <div className="text-gold font-display text-2xl">{it.t}</div>
                <div className="text-muted-foreground">{it.title}</div>
              </div>
              <div className={i % 2 ? "order-1" : ""} />
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-3 rounded-full bg-gold shadow-[0_0_0_4px_var(--background),0_0_15px_var(--gold)]" />
            </div>
          ))}
        </div>
      </Section>

      {/* COUNTDOWN */}
      <Section className="relative">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `url(${pattern})`,
            backgroundSize: "cover",
          }}
        />
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-display italic">Counting the Days</h2>
          <Ornament />
          <p className="text-muted-foreground mb-10">Until we welcome you with open hearts</p>
          <Countdown target={EVENT.target} />
        </div>
      </Section>

      {/* GALLERY */}
      <Section className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-display italic">Moments</h2>
          <Ornament />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[g1, g2, g3, g4].map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft border border-border/40"
            >
              <img
                src={src}
                alt={`Memory ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* DUA */}
      <Section className="max-w-3xl mx-auto text-center">
        <Heart className="size-6 text-gold mx-auto mb-4" />
        <h2 className="text-4xl sm:text-5xl font-display italic">A Du'a for Our Baby</h2>
        <Ornament />
        <p className="font-arabic text-2xl sm:text-3xl text-gold leading-loose">
          أُعِيذُكَ بِكَلِمَاتِ اللَّهِ التَّامَّةِ
          <br />
          مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ
        </p>
        <p className="mt-6 text-muted-foreground italic">
          "I seek refuge for you in the Perfect Words of Allah from every devil, every harm, and
          every evil eye."
        </p>
        <p className="mt-6 text-foreground">
          May Allah bless {EVENT.baby.split(" ")[0]} with iman, health, and a heart full of light.
          Ameen.
        </p>
      </Section>

      {/* RSVP + MAP */}
      <Section id="rsvp" className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur p-8 shadow-luxe text-center flex flex-col justify-center">
            <h3 className="font-display text-3xl">Will You Join Us?</h3>
            <Ornament />
            <p className="text-muted-foreground mb-6">
              Your presence is the greatest gift. Kindly confirm your attendance.
            </p>
            <a
              href={`https://wa.me/${EVENT.phoneTel.replace(/\D/g, "")}?text=${encodeURIComponent("Assalamualaikum — I would like to confirm my attendance for Wajdan's Aqiqah, In Sha Allah.")}`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-gold text-primary-foreground font-medium tracking-wide shadow-luxe hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Confirm via WhatsApp
            </a>
            <a
              href={`tel:${EVENT.phoneTel}`}
              className="mt-4 block text-sm text-gold hover:underline"
            >
              {EVENT.phone}
            </a>
            <p className="mt-4 text-xs text-muted-foreground">Kindly respond by {EVENT.rsvpBy}</p>
          </div>
          <div>
            <iframe
              title="Venue Location"
              src="https://www.google.com/maps?q=North+Karachi+Sector+11-B&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, filter: "sepia(20%) saturate(90%)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="relative pt-20 pb-10 text-center overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-24 opacity-40"
          style={{
            backgroundImage: `url(${pattern})`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div className="font-arabic text-2xl text-gold mb-3">و الحمد لله</div>
        <p className="text-muted-foreground italic">With gratitude — {EVENT.parents}</p>
        <p className="mt-6 text-xs text-muted-foreground tracking-widest">
          AQIQAH · {EVENT.baby.toUpperCase()} · 2026
        </p>
      </footer>
    </div>
  );
}

export const EVENT_BABY = EVENT.baby;
