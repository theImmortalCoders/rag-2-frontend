/* eslint-disable max-lines */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accessibility-statement',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: [
    `
      .accessibility-container {
        min-height: 100vh;
        background-color: white;
        margin-top: -1.25rem;
        padding-top: 2rem;
        padding-bottom: 2rem;
        padding-left: 14rem;
        padding-right: 14rem;
      }
    `,
  ],
  template: `
    <div class="accessibility-container">
      <h1>Accessibility statement</h1>
      <section id="a11y-wstep">
        <p>
          <span id="a11-podmiot">Rzeszów University of Technology</span> is
          committed to making its
          <span id="a11y-zakres">website</span> accessible, in accordance with
          Act of 4 April 2019 on digital accessibility of websites and mobile
          applications of public entities.
        </p>
        <p>
          This accessibility statement applies to
          <a id="a11y-url" href="https://rutai.kia.prz.edu.pl/"
            >https://rutai.kia.prz.edu.pl/</a
          >.
        </p>
      </section>
      <p>
        Date of website publication:
        <time id="a11y-data-publikacja" datetime="2024-11-12"
          >11th November 2024</time
        >
      </p>
      <p>
        Last major update:
        <time id="a11y-data-aktualizacja" datetime="2025-02-15"
          >15th February 2025</time
        >
      </p>
      <h2>Compliance status</h2>
      <p id="a11y-status">
        This website is <strong>partially compliant</strong> with the appendix
        to the Act of April 4, 2019, on digital accessibility of websites and
        mobile applications of public entities due to the non-compliances listed
        below.
      </p>
      <h2>Non-accessible content</h2>
      <h3>Non-compliance with the appendix</h3>
      <ul>
        <li>
          Missing &lt;h1&gt; headings on each page, lack of hierarchical heading
          structure - https://rutai.kia.prz.edu.pl/;
        </li>
        <li>
          Lack of contrast between the text and the background minimum ratio of
          3:1 in the description of each game -
          https://rutai.kia.prz.edu.pl/game-list;
        </li>
        <li>
          Active element in the form of a thumbnail of each game cannot be used
          for navigation with keyboard - https://rutai.kia.prz.edu.pl/game-list;
        </li>
        <li>
          There is no search bar or sitemap on the pages -
          https://rutai.kia.prz.edu.pl/;
        </li>
        <li>
          There is a lack of a grouping tag for fields with similar functions or
          providing information of a similar nature in the registration and
          login form - https://rutai.kia.prz.edu.pl/register,
          https://rutai.kia.prz.edu.pl/login;
        </li>
        <li>
          Status or error messages are only available after the focus is moved -
          https://rutai.kia.prz.edu.pl/game/pong (and other games),
          https://rutai.kia.prz.edu.pl/register,
          https://rutai.kia.prz.edu.pl/login,
          https://rutai.kia.prz.edu.pl/dashboard;
        </li>
      </ul>
      <h2>Preparation of this accessibility statement</h2>
      <p>
        This statement was prepared on:
        <time id="a11y-data-sporzadzenie" datetime="2025-02-15"
          >15th February 2025</time
        >
      </p>
      <p>
        The statement was last reviewed on:
        <time id="a11y-data-sporzadzenie" datetime="2025-02-15"
          >15th February 2025</time
        >
      </p>
      <p>
        This statement was prepared on
        <strong>a self-assessment done by the public sector body</strong>.
        <a
          href="docs/lista_kontrolna_do_badania_dostepnosci_cyfrowej_strony_rutai_kia_prz_edu_pl.pdf"
          >An evaluation report</a
        >.
      </p>
      <h2>Keyboard shortcuts</h2>
      <p>You can use standard keyboard shortcuts on the website.</p>
      <h2>Feedback and contact information</h2>
      <p>
        Any issues with the digital accessibility of this website should be
        reported to <span id="a11y-kontakt">Anna Szczepek</span>: e-mail
        <a id="a11y-email " href="mailto:aniasz@prz.edu.pl"
          >aniasz&#64;prz.edu.pl</a
        >, phone <a href="tel:+48177432217" id="a11y-telefon">17 743 2217</a>.
      </p>
      <p>
        Everyone has the right to make a request to ensure the digital
        accessibility of this website or its elements.
      </p>
      <p>When making such a request, you should provide:</p>
      <ul>
        <li>your name and surname,</li>
        <li>your contact details (e.g. phone number, e-mail),</li>
        <li>
          the exact address of the website on which the element or content is
          digitally inaccessible,
        </li>
        <li>
          a description of the problem and the most convenient way to solve it.
        </li>
      </ul>
      <p>
        We will respond to your request as soon as possible, no later than
        within 7 days of receiving it.
      </p>
      <p>
        If this deadline is too short for us, we will inform you about it. We
        will provide a new deadline by which we will correct the reported errors
        or prepare the information in an alternative way. This new deadline will
        not be longer than 2 months.
      </p>
      <p>
        If we are unable to ensure the digital accessibility of the website or
        content indicated in the request, we will propose access to them in an
        alternative way.
      </p>
      <section id="a11y-procedura">
        <h2>Enforcement procedure</h2>
        <p>
          If we refuse to provide the requested digital accessibility and you do
          not agree with this refusal, you have the right to file a complaint.
        </p>
        <p>
          You also have the right to file a complaint if you do not agree to use
          the alternative method of access that we have proposed in response to
          your request to provide digital accessibility.
        </p>
        <p>
          Any complaints should be submitted by letter or email to the
          accessibility coordinator at the Rzeszów University of Technology:
        </p>
        <p>
          Artur Majcher<br />
          Politechnika Rzeszowska im. Ignacego Łukasiewicza<br />
          al. Powstańców Warszawy 12<br />
          35-959 Rzeszów
        </p>
        <p>
          e-mail:
          <a href="mailto:dostepnosc@prz.edu.pl">dostepnosc&#64;prz.edu.pl</a>.
        </p>
        <p>
          Information that can be found on the government
          <a
            href="https://www.gov.pl/web/gov/zloz-wniosek-o-zapewnieniedostepnosci-cyfrowej-strony-internetowej-lub-aplikacji-mobilnej"
            >portal gov.pl</a
          >
          may be helpful.
        </p>
        <p>
          You can also inform the
          <a href="https://bip.brpo.gov.pl/">Commissioner for Human Rights</a>
          about this situation and ask for intervention in the reported case.
        </p>
      </section>
      <h2>Other information</h2>
      <section id="a11y-aplikacje">
        <h3>Mobile applications</h3>
        <p>
          Rzeszów University of Technology has the mobile application called
          Mobilny USOS:
        </p>
        <ul>
          <li>
            <a
              href="https://play.google.com/store/apps/details?id=pl.edu.prz.mobilny"
              >download</a
            >
            Android version -
            <a
              href="https://usos.prz.edu.pl/kontroler.php?_action=dodatki/mobilny_usos/deklaracjaDostepnosci&amp;app=android"
              >accessibility statement of application (Android)</a
            >;
          </li>
          <li>
            <a
              href="https://apps.apple.com/pl/app/mobilny-usos-prz/id1516903086?l=pl"
              >download</a
            >
            iOS version -
            <a
              href="https://usos.prz.edu.pl/kontroler.php?_action=dodatki/mobilny_usos/deklaracjaDostepnosci&amp;app=iOS"
              >accessibility statement of application (iOS)</a
            >.
          </li>
        </ul>
      </section>
      <section id="a11y-architektura">
        <h3>Architectural accessibility</h3>
        <p>
          <a
            id="a11y-architektura-url"
            href="https://dostepnosc.prz.edu.pl/dostepnosc-architektoniczna"
            >Details of the architectural accessibility of Rzeszów University of
            Technology buildings.</a
          >
        </p>
      </section>
      <section id="a11y-komunikacja">
        <h3>Information and communication accessibility</h3>
        <p>
          Rzeszów University of Technology provides the following forms of
          communication support to people with special needs:
        </p>
        <ul>
          <li>telephone (landline during university working hours, mobile);</li>
          <li>correspondence (postal, e-mail);</li>
          <li>text messages, including SMS, MMS, instant messaging;</li>
          <li>faxes;</li>
          <li>
            using the services of a Polish sign language interpreter via the
            website (<a href="https://tlumacz.migam.org/politechnika_rzeszowska"
              >online interpreter</a
            >) during university working hours.
          </li>
        </ul>
        <p>
          Rzeszów University of Technology has devices for the hearing impaired
          – induction loops installed in the locations mentioned below:
        </p>
        <ol>
          <li>
            Building V (Powstańców Warszawy 12):
            <ul>
              <li>lecture hall V-2;</li>
            </ul>
          </li>
          <li>
            Building A (W. Pola 2):
            <ul>
              <li>dean's office A-107;</li>
              <li>assembly hall A-61;</li>
            </ul>
          </li>
          <li>
            Building P (Poznańska 2):
            <ul>
              <li>dean's office P-136;</li>
              <li>lecture hall P-2;</li>
              <li>lecture hall P-15;</li>
            </ul>
          </li>
          <li>
            Building H (Powstańców Warszawy 6):
            <ul>
              <li>lecture hall H-8;</li>
              <li>conference room of The Faculty of Chemistry;</li>
            </ul>
          </li>
          <li>
            Building S (Powstańców Warszawy 10):
            <ul>
              <li>dean's office S-14;</li>
              <li>lecture hall S-1;</li>
            </ul>
          </li>
          <li>
            Building L (Powstańców Warszawy 8):
            <ul>
              <li>dean's office L-100;</li>
              <li>dean's office L-120.</li>
            </ul>
          </li>
        </ol>
        <p>
          <a
            href="https://prz.edu.pl/uczelnia/dzialania-na-rzecz-poprawy-zapewniania-dostepnosci/o-politechnice-rzeszowskiej---tekst-latwy-do-czytania-etr"
            >Information about Rzeszów University of Technology in an
            easy-to-read and understand text (ETR).</a
          >
        </p>
      </section>
    </div>
  `,
})
export class AccessibilityStatementComponent {}
