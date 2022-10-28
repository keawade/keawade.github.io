import Link from "next/link";

export default function About() {
  return (
    <>
      <p>
        I enjoy solving problems. This is what inspires me to work as a software
        developer. I am currently a software developer for
        <Link href="https://nelnetinc.com/capabilities/consumer-services/nelnet-velocity/">
          Nelnet
        </Link>
        .
      </p>

      <h2>Work History</h2>

      <h3>Nelnet 2018-Present</h3>

      <b>Full Stack Developer</b>

      <ul>
        <li>
          Full stack development with React/Typescript front end and
          Node/Typescript back end.
        </li>
        <li>
          Leveraged Typescript, object oriented programming, domain driven
          design, and functional programming to build services and libraries for
          a microservices platform.
        </li>
        <li>Technical lead for a product deployment implementation squad.</li>
        <li>
          Implemented CI/CD processes for testing, building, releasing, and
          deploying services and libraries with Bitbucket Pipelines.
        </li>
        <li>
          Worked with team to migrate code hosting and CI/CD processes from
          Bitbucket and Bitbucket Pipelines to GitHub and GitHub Actions.
        </li>
        <li>
          Helped build Nelnet&apos;s first successful design system based on
          Material Design to help designers and developers collaborate on
          building beautiful and accessible user interfaces and experiences.
        </li>
        <li>
          Developed internal CLI tool for managing private registry
          authentication, repository templating, and services deployment.
        </li>
        <li>
          Developed software in agile environments with an emphasis on finding
          processes and tools to support the given team rather than adhering to
          specific methodologies religiously.
        </li>
        <li>
          Prepared and facilitated eight instances of one month long developer
          &quot;immersion&quot; training sessions to cross train existing
          development staff on a new microservices platform and tech stack.
        </li>
      </ul>

      <h3>Nanonation, Inc. 2016-2018</h3>

      <b>Software Developer</b>

      <li>
        Full stack development with React/Typescript front end and ASP .NET back
        end.
      </li>
      <li>
        Partnered with a senior developer to reinvent our digital signage
        content management system used to manage over 40,000 client devices.
      </li>
      <li>
        Empowered our Customer&apos;s ability to effectively reach target
        audiences by developing hardware and web API integrations for their
        digital signage solutions.
      </li>

      <h3>Union College 2012-2016</h3>

      <b>Information Systems Server Technician</b>

      <li>
        Improved our server system&apos;s efficiency and maintainability by
        implementing a Hyper-V virtualization server cluster and migrating our
        existing server infrastructure to the cluster.
      </li>
      <li>
        Provisioned and maintained over a dozen servers in a mixed Windows and
        Linux environment.
      </li>
      <li>
        Improved personal efficiency by automating tasks with PowerShell, Bash,
        and batch scripts.
      </li>

      <b>Information Systems Desktop Technician</b>

      <li>Was part of a team that provided support for over 700 users</li>
      <li>Set up over 140 machines from box to user</li>

      <h3>Union College 2015-2016 Extracurricular</h3>

      <b>Tech & Tabletop Club Officer</b>

      <li>Organized monthly technology lectures for students</li>
      <li>Designed and maintained the club website</li>
    </>
  );
}
