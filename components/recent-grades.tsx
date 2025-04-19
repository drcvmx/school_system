import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentGrades() {
  return (
    <div className="space-y-8">
      {recentGrades.map((grade) => (
        <div key={grade.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={grade.student.avatar || "/placeholder.svg"} alt={grade.student.name} />
            <AvatarFallback>{grade.student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{grade.student.name}</p>
            <p className="text-sm text-muted-foreground">
              {grade.subject} - {grade.teacher}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span className={`text-sm ${getGradeColor(grade.value)}`}>{grade.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getGradeColor(grade: number) {
  if (grade >= 9) return "text-green-500"
  if (grade >= 7) return "text-yellow-500"
  return "text-red-500"
}

const recentGrades = [
  {
    id: "1",
    student: {
      name: "Sofia Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "Mathematics",
    teacher: "Mr. Johnson",
    value: 9.5,
  },
  {
    id: "2",
    student: {
      name: "Carlos Martinez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "Science",
    teacher: "Mrs. Smith",
    value: 8.7,
  },
  {
    id: "3",
    student: {
      name: "Ana Garcia",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "History",
    teacher: "Mr. Williams",
    value: 7.2,
  },
  {
    id: "4",
    student: {
      name: "Miguel Lopez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "Language",
    teacher: "Ms. Brown",
    value: 6.5,
  },
  {
    id: "5",
    student: {
      name: "Isabella Hernandez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    subject: "Art",
    teacher: "Mrs. Davis",
    value: 9.8,
  },
]
