import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const reviews = [
  {
    name: "Rachel Martinez",
    username: "@rachelm",
    body: "Operone's agent system transformed our workflow. AI integration is seamless and powerful!",
    img: "https://avatars.githubusercontent.com/u/75433?v=4",
  },
  {
    name: "James Wilson",
    username: "@jwilson",
    body: "Context management is brilliant. Handles complex state management effortlessly. Love it!",
    img: "https://avatars.githubusercontent.com/u/293343?v=4",
  },
  {
    name: "Sophia Chen",
    username: "@sophiach",
    body: "Great platform, but learning curve was steep. Fantastic once past initial setup.",
    img: "https://avatars.githubusercontent.com/u/624860?v=4",
  },
  {
    name: "Michael Brown",
    username: "@mbrown",
    body: "Automation capabilities are incredible. Productivity increased by 40%. Game changer!",
    img: "https://avatars.githubusercontent.com/u/149820?v=4",
  },
  {
    name: "Emma Thompson",
    username: "@emmat",
    body: "Initial configuration issues, but support was amazing. Works like a dream now!",
    img: "https://avatars.githubusercontent.com/u/28929934?v=4",
  },
  {
    name: "Daniel Kim",
    username: "@dkim",
    body: "Good tool, but needs better documentation. Powerful features once you figure them out.",
    img: "https://avatars.githubusercontent.com/u/62455?v=4",
  },
  {
    name: "Alex Johnson",
    username: "@alexj",
    body: "Terrible experience. Constant bugs and poor support. Wasted months. Avoid!",
    img: "https://avatars.githubusercontent.com/u/8397654?v=4",
  },
  {
    name: "Lisa Wang",
    username: "@lisaw",
    body: "Mixed feelings. AI features are revolutionary, but platform can be unstable.",
    img: "https://avatars.githubusercontent.com/u/1234567?v=4",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarImage src={img} alt={`${name} profile picture`} loading="lazy" />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function ReviewSection() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
