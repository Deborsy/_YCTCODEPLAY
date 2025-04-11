import Image from "next/image";
import './styles/index.css'

export default function Home() {
  return (
    <>
      <nav>
          <ul>
              <li><a href="/" className="active">Home</a></li>
              <li><a href="">Courses</a></li>
              <li><a href="/contactus">Contact Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/signup" className="signup">Sign up +</a></li>
          </ul>
      </nav>
      <header>
        <div className="header-container">
              <div className="brand-name">
                  <Image src="/YCT CODEPLAY-logo 1.png" width={100} height={100} alt="logo"/>
              </div>
              <div className="btns">
                  <a href="/login" className="login">Login</a>
                  <a href="/signup" className="signup">Signup +</a>
                  <a href="#">+</a>
              </div>
        </div>
        <div className="contents">
              <h3>Coding simplified for students</h3>
              <h2>Learn To <span>Code.</span></h2>
              <h1>Build Your Future!</h1>
              <p>
                  Yctcodeplay is the coding platform for students and learners at every level
              </p>
              <p>Start coding with hands-on exercises, guided tutorial, and practical project</p>
              <p>tailored to help you grow, one line of code at a time.</p>

              <div className="btn">
                  <a href="/login" className="loginbtn">Login</a>
                  <a href="/signup" className="Get_started">Get Coding{} <span>-{">"}</span></a>
              </div>
        </div>

        <div className="boxes">
          <span style={{ background: "blue" }} className="html">
            Html
          </span>
          <span style={{ background: "white", color: "#000" }} className="css">
            Css
          </span>
          <span style={{ background: "grey", color: "#000" }} className="kotlin">
            Kotlin
          </span>
          <span style={{ background: "rgb(26, 193, 26)" }} className="Ruby">
            Ruby
          </span>
          <span style={{ background: "white", color: "#000" }} className="php">
            PHP
          </span>
          <span style={{ background: "rgb(26, 193, 26)" }} className="javascript">
            Javascript
          </span>
          <span style={{ background: "blue" }}>Node js</span>
          <span style={{ background: "rgb(26, 193, 26)" }} className="python">
            Python
          </span>
          <span style={{ background: "#fff", color: "#000" }} className="java">
            Java
          </span>
          <span style={{ background: "yellow", color: "#000" }} className="Git">
            Git
          </span>
          <span style={{ background: "purple" }}>JQuery</span>
          <span style={{ background: "yellow", color: "#000" }}>Docker</span>
          <span style={{ background: "white", color: "#000" }}>React.JS</span>
          <span style={{ background: "purple" }}>Dart</span>
          <span style={{ background: "grey" }}>Swift</span>
          <span style={{ background: "yellow", color: "#000" }}>
            Objective C
          </span>
          <span style={{ background: "green", color: "white" }}>C#</span>
          <span style={{ background: "blue" }}>C++</span>
          <span style={{ background: "yellow", color: "#000" }}>C</span>
          <span style={{ background: "blue" }}>GO</span>
        </div>
        <div className="img">
            <Image src="/Man2.png"  width={100} height={100} alt=""/>
        </div>
      </header>
      <section className="circle-section">
          <h5>WHY YCT CODEPLAY?</h5>
          <h2>We believe</h2>
          <h1>in the potential <span>for</span> <br/> technology <span>to reshape the</span> <br/> learning experience</h1>
          <div className="circles">
              <div className="circle">
                  <h3>5000+</h3>
                  <p>students willing to <br/> learn coding skills</p>
              </div>
              <div className="circle">
                  <h3>15K+</h3>
                  <p>courses already</p>
                  <p>completed on YCT</p>
                  <p>CodePlay</p>
              </div>
              <div className="circle" id="img">
                  <Image src="/2 (1).png" width={100} height={100} alt="student"/>
              </div>
              <div className="circle">
                  <h3>40K+</h3>
                  <p>Jobs available globally <br/> to skilled tech pre-grads</p>
              </div>
              <div className="circle">
                  <h3>300</h3>
                  <p>student optimized coding</p>
                  <p>courses offers by YCT</p>
                  <p>CodePlay</p>
              </div>
          </div>
          <Image src="/SuperToroid-2.png" width={100} height={100} alt=""/>
      </section>
      <section className="handsUp">
          <div className="handsUp_container">
              <Image src="/YCT CODEPLAY-logo 1.png" width={100} height={100} alt=""/>
              <h1>Tired of regular, Boring</h1>
              <h1> coding methods?</h1>
              <span className="paragraph">
                  <p>Get started with your <strong>Student Focused</strong> coding learning</p>
                  <p> and practice journey on YCT CodePlay now!</p>
              </span>
              <div className="btn">
                  <a href="/login" className="loginbtn">Login</a>
                  <a href="/signup" className="Get_started">Get Coding{} <span>-{">"}</span></a>
              </div>
              <div className="handsUp-img">
                  <Image src="/image 1.png" width={100} height={100} alt=""/>
              </div>
          </div>
      </section>
      <section className="designs_container">
          <h5>HOW DOES YCT CODEPLAY WORK</h5>
          <h2>How we work</h2>
          <h1>we curated the best <span>young & <br/> skilled</span> tech minds to create <br/> over <span>50</span> Coding courses.</h1>

          <div className="screen-container">
              <div className="first-screen">
                  <div className="card-head">
                      <h5>Website Dev.</h5>
                      <h1>Website Development</h1>
                      <p>Learn to Build web apps like e.g E-commerce, product display, company profile etc.. type website</p>
                  </div>
                  <div className="card-body">
                      <Image src="/Video Call - Wireframe - Code Window Open 1.png" width={100} height={100} alt=""/>
                  </div>
              </div>
              <div className="second-screen">
                  <div className="card-head">
                      <h5>Mobile App Dev</h5>
                      <h1>Mobile App Dev</h1>
                      <p>Work on learning to builf cross platform / single platform mobile apps using Java, swift, React native as seen in the example <span>Rushbox</span> below</p>
                  </div>
                  <div className="card-body">
                      <Image src="/iMockup - iPhone 14.png" width={100} height={100} alt=""/>
                  </div>
              </div>
              <div className="third-screen">
                  <div className="card-head">
                    <h5>UI/UX Design</h5>
                    <h1>User Interface & User <br/> Experience Design</h1>
                  </div>
                  <div className="btn">
                    <a className="loginbtn">coming soon...</a>
                  </div>
              </div>
              <div className="forth-screen">
                  <div className="card-head">
                    <h5>Backend Dev.</h5>
                    <h1>Learn to build complex <br/> Backend applications & <br/> APIs</h1>
                  </div>
                      <Image className="image1" width={100} height={100} src="/Vector (1).png" alt=""/>
                      <Image className="image2" width={100} height={100} src="/Vector (2).png" alt=""/>
                      <Image className="image3" width={100} height={100} src="/Vector.png" alt=""/>
              </div>
          </div>
      </section>

      <section className="faq-section">
          <div className="gradient"></div>
          <div className="faq-container">
              <div className="faq-head">
                  <h1>Questions asked</h1>
                  <h1>about YCT CodePlay</h1>
              </div>
              <div className="faq-paragraph">
                  <p>Here are some commonly asked questions about our <span>Student </span></p>
                  <p><span> Focused</span> code Learning platform YCT CodePlay</p>
              </div>
              <div className="content">
                  <details className="faq-item">
                      <summary>01 How do I signup?</summary>
                      <p>Here are some commonly asked questions about our Student Focused code learning platform YCT CodePlay.</p>
                  </details>
                  <details className="faq-item">
                      <summary>02 How many courses are on YCT CodePlay?</summary>
                      <p>There are over 50 courses available on YCT CodePlay.</p>
                  </details>
                  <details className="faq-item">
                      <summary>03 Is YCT CodePlay only for YabaTech Students?</summary>
                      <p>YCT CodePlay is open to all students interested in coding.</p>
                  </details>
                  <details className="faq-item">
                      <summary>04 Is YCT CodePlay going to be online forever?</summary>
                      <p>Yes, YCT CodePlay will remain online indefinitely.</p>
                  </details>
                  <details className="faq-item">
                      <summary>05 How mucg do I have to pay to use YCT CodePlay?</summary>
                      <p>YCT CodePlay is completely free for all students.</p>
                  </details>
              </div>
          </div>
      </section>

      <div className="marquee-container">
          <div className="marquee">
              <span>✨ Affordable ✨ Student Focused ✨ Great UX ✨ 50+ Courses ✨</span>
              <span>✨ Affordable ✨ Student Focused ✨ Great UX ✨ 50+ Courses ✨</span>
          </div>
      </div>

      <section className="action_call">
          <h5>FINALLY.</h5>
          <h1>Join the Software Revolution</h1>
          <p>Get started with your <span>Student Focused</span> coding learning</p>
          <p>and practice journey on YCT CodePlay now!</p>

          <Image src="/Brown-in-Jumper10.png" width={100} height={100} alt=""/>

          <div className="btn">
              <a href="/signup" className="Get_started">Get Coding{} <span>-{">"}</span></a>
              <a href="/login" className="loginbtn">Login</a>
          </div>
      </section>

      <footer>
          <div className="logo">
              <Image src="/YCT CODEPLAY-logo 1.png" width={100} height={100} alt="logo" />
          </div>
          <div className="members">
              <div className="supervisor">
                  <h5>Supervisor</h5>
                  <a href="#">DR. Okikiola</a>
              </div>
              <div className="team-members">
                  <h5>Team</h5>
                  <a href="#">Shobayo Benjamin (Developer)</a>
                  <a href="#">Ijaodola Tope (Designer)</a>
                  <h4>Komolafe Joseph</h4>
                  <h4>Bello Tolulope</h4>
                  <h4>Oyeleke Praise</h4>
                  <h4>Olayuwa Rebecca</h4>
                  <h4>Bitrus Oluwatimileyin</h4>
                  <h4>Oji Basil</h4>
                  <h4>Bolaji Fuad</h4>
                  <h4>Samuel</h4>
                  <h4>Johnson Musa Akorede</h4>
              </div>
          </div>
          <Image src="/Saly-11.png" className="object-contain" width={100} height={100} alt="student"/>
      </footer>
    </>
  );
}
