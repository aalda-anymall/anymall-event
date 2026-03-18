import Image from "next/image";
import { SlotState } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/landing/section-heading";
import { EventSection } from "@/components/landing/event-section";
import { Icon } from "@/components/icon";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function HomePage() {
  const slots = await prisma.slot.findMany({
    include: {
      venue: {
        select: { name: true, address: true },
      },
    },
    orderBy: { startsAt: "asc" },
  });

  const acceptingSlots = slots
    .filter((s) => s.state === SlotState.ACCEPTING_APPLICATIONS)
    .map((s) => ({
      ...s,
      applicationBegin: s.applicationBegin.toISOString(),
      applicationDeadline: s.applicationDeadline.toISOString(),
      lotteryResultTime: s.lotteryResultTime.toISOString(),
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

  const comingSlots = slots
    .filter((s) => s.state === SlotState.APPLICATIONS_CLOSED)
    .map((s) => ({
      ...s,
      applicationBegin: s.applicationBegin.toISOString(),
      applicationDeadline: s.applicationDeadline.toISOString(),
      lotteryResultTime: s.lotteryResultTime.toISOString(),
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

  const venues = await prisma.venue.findMany();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* Hero */}
      <section className="relative h-[665px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="愛犬と過ごす特別なひととき"
            fill
            className="object-cover pb-40 md:pb-0"
            priority
          />
        </div>
        <div
          className="md:hidden absolute left-0 bottom-0 h-[390px] w-full"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #E8EDDF 30%)",
          }}
        />

        <div className="absolute left-0 bottom-0 flex w-full pb-32 flex-col items-center gap-4 px-4">
          <h1 className="text-center font-serif text-[32px] leading-[48px] text-brand-green-accent">
            <span className="inline-block bg-white pt-0.5 pb-1 px-2">
              愛犬と過ごす、
            </span>
            <br />
            <span className="inline-block bg-white pt-0.5 pb-1 px-2">
              特別なひととき。
            </span>
          </h1>
          <p className="text-center text-[15px] leading-7 text-warm-700">
            大切な愛犬との暮らしがもっと豊かになる、体験型イベント。
            <br />
            食事・健康・ライフスタイルを、専門家と一緒に楽しく学びませんか。
          </p>
        </div>

        <a
          href="#events"
          className="absolute left-1/2 top-[562px] -translate-x-1/2 rounded-full bg-brand-green px-8 py-4 text-[15px] font-semibold text-white"
        >
          イベントを見る ↓
        </a>
      </section>

      {/* Theme */}
      <section className="px-4 py-8">
        <div className="flex flex-col gap-8">
          <SectionHeading
            sub="Theme"
            label="ペットとの暮らしを、もっと楽しむために。"
          />

          <div className="text-base leading-7 text-warm-600">
            <p>
              獣医師監修のもと、ペットの食事・健康・生活に関するテーマを取り上げた少人数制イベントを開催します。
            </p>
            <p>
              ランチを楽しみながら、栄養学、手作りフード、犬種別の健康管理、長寿の秘訣など、
              愛犬との暮らしに役立つ知識やヒントを学べる特別な時間です。
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: "Bone" as const,
                text: "愛犬にあう食事の考え方/付き合い方",
              },
              {
                icon: "Utensils" as const,
                text: "はじめての手作りごはんの作り方",
              },
              {
                icon: "Activity" as const,
                text: "犬種ごとに起きやすい健康トラブル",
              },
              {
                icon: "Heart" as const,
                text: "愛犬の長生きのためにできること",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-lg bg-warm-100">
                  <Icon className="text-[#C4A882]" name={item.icon} size="24" />
                </div>
                <p className="font-serif text-[17px] font-semibold text-warm-800">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="bg-warm-50 px-4 py-8">
        <div className="flex flex-col gap-8">
          <SectionHeading sub="Venue" label="開催場所" />

          <div className="flex flex-col gap-6">
            {[
              {
                name: "inumo 芝公園 by Villa Fontaine",
                nameEn: "inumo Shiba Park by Villa Fontaine",
                address: "〒105-0014 東京都港区芝１丁目６−５",
                description:
                  "芝公園に隣接するペットフレンドリーな複合施設。 愛犬と一緒にくつろげる開放的な空間で、特別なイベントをお楽しみいただけます。",
                image: "/images/venue-inumo.png",
              },
              {
                name: "Dyplus OSAKA KITA",
                nameEn: "Dyplus OSAKA KITA",
                address: "〒530-0042 大阪府大阪市北区天満橋3丁目4番25号",
                description:
                  "芝公園に隣接するペットフレンドリーな複合施設。 愛犬と一緒にくつろげる開放的な空間で、特別なイベントをお楽しみいただけます。",
                image: "/images/venue-dyplus.png",
              },
            ].map((venue) => (
              <div
                key={venue.name}
                className="overflow-hidden rounded-lg border border-warm-200 bg-white"
              >
                <div className="relative h-[242px] bg-[#ccc]">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4 px-4 pb-4 pt-2">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-serif text-[22px] font-bold text-warm-900">
                      {venue.name}
                    </h3>
                    <p className="text-[13px] italic leading-[23.4px] text-warm-500">
                      {venue.nameEn}
                    </p>
                  </div>
                  <p className="flex items-center text-base leading-[23.4px] text-warm-500">
                    <Icon className="text-[#8a8a8a]" name="MapPin" size={16} />
                    {venue.address}
                  </p>
                  <p className="text-base leading-6 text-warm-500">
                    {venue.description}
                  </p>
                  <div className="relative h-[96px] w-full overflow-hidden">
                    <Image
                      src="/images/venue-map.png"
                      alt="Map"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <EventSection acceptingSlots={acceptingSlots} comingSlots={comingSlots} />

      {/* Speaker */}
      <section className="bg-brand-green-bg px-4 py-8">
        <div className="flex flex-col gap-8">
          <SectionHeading sub="Instructor" label="登壇者紹介" />

          <div className="flex flex-col gap-12">
            {[
              {
                name: "まなみ獣医師",
                title: "獣医師 / 愛犬ごはん研究家",
                bio: "「獣医師まなみの愛犬ごはん」主宰。\n栄養学と臨床経験に基づく科学的根拠のある手作りごはんを提唱し、SNS総フォロワー数は数万人規模。\n飼い主目線の実践的アドバイスで圧倒的な支持を集めています。",
                image: "/images/speaker-manami.png",
              },
              {
                name: "中村 篤史",
                title: "獣医師 / A'aldaの動物病院グループ総院長",
                bio: "A'aldaの動物病院グループ総院長として国内最大級の動物病院グループを統括。獣医療の現場と経営の両面から、ペットと飼い主の未来を見据えたビジョンを発信しています。",
                image: "/images/speaker-nakamura.png",
              },
            ].map((speaker) => (
              <div
                key={speaker.name}
                className="flex flex-col items-center rounded-2xl bg-white p-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative size-[200px]">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-brand-green-light ring-offset-2" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center font-bold">
                    <p className="text-2xl text-warm-900">{speaker.name}</p>
                    <p className="text-lg text-brand-green-dark">
                      {speaker.title}
                    </p>
                  </div>
                  <p className="whitespace-pre-line text-base leading-6 text-warm-900">
                    {speaker.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner */}
      <section className="bg-white py-16">
        <div className="flex flex-col items-center gap-10">
          <SectionHeading sub="Partner" label="パートナー" />
          <div className="flex flex-col items-center gap-16">
            <Image
              src="/images/partner-diners.png"
              alt="Diners Club International"
              width={132}
              height={96}
            />
            <Image
              src="/images/partner-fpc.png"
              alt="FPC"
              width={90}
              height={80}
            />
            <Image
              src="/images/partner-panasonic.png"
              alt="Panasonic"
              width={241}
              height={37}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
