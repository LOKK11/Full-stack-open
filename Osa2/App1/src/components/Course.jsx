const SubHeader = ({ course }) => <h2>{course}</h2>

const Part = ({ part, exercises }) => <p>{part} {exercises}</p>

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part.name} exercises={part.exercises} />
            )}
            <Total parts={parts} />
        </div>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <SubHeader course={course.name} />
            <Content parts={course.parts} />
        </div>
    )
}



const Total = ({ parts }) => (
    <p><strong>Total of exercises {parts.reduce((sum, part) => sum + part.exercises, 0)}</strong></p>
)

export default Course
