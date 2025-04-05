// app/terms/page.tsx (Next.js App Router)
// or pages/terms.tsx (Pages Router)

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">
        Effective Date: April 5, 2025
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing and using <strong>Lost.Finance</strong>, you agree to
          comply with and be bound by the following terms and conditions. If you
          do not agree, please do not use the site.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">2. Purpose of the Platform</h2>
        <p>
          Lost.Finance is a public platform for surfacing crypto-related crime
          reports based on verifiable, public data. It is intended to increase
          transparency and accountability in decentralized finance.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">3. Prohibited Activities</h2>
        <p>By using Lost.Finance, you agree NOT to:</p>
        <ul className="list-disc list-inside">
          <li>Submit false, misleading, or unverified information</li>
          <li>Make fake or malicious reports</li>
          <li>Spam the platform with repetitive or irrelevant content</li>
          <li>Attempt to falsify or manipulate on-chain records</li>
          <li>
            Exploit or interfere with the smart contract or backend system
          </li>
        </ul>
        <p>
          Any violations may result in your reports being rejected, flagged, or
          permanently removed. Legal action may be taken in cases of abuse or
          fraud.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">4. No Warranty</h2>
        <p>
          Lost.Finance is provided "as is" without warranties of any kind. We do
          not guarantee the accuracy, completeness, or reliability of any report
          submitted or displayed on the platform.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">5. User Responsibility</h2>
        <p>
          You are solely responsible for the content you contribute or interact
          with. Do not impersonate others or misrepresent facts. Your
          participation must comply with applicable laws and ethical standards.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">6. Open Source Disclosure</h2>
        <p>
          Lost.Finance is an open-source platform. Code is publicly available
          at:{" "}
          <a
            href="https://github.com/dvncan/lost.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            github.com/dvncan/lost.finance
          </a>
        </p>
        <p>
          You may use or fork the code, but you must not abuse the production
          platform or impersonate official content.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">7. Modification of Terms</h2>
        <p>
          We may update these Terms at any time. Continued use of the platform
          after changes means you accept the new terms.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">8. Contact</h2>
        <p>
          Questions about these terms? Reach out to us at:{" "}
          <a href="mailto:your@email.com" className="text-blue-600 underline">
            your@email.com
          </a>
        </p>
      </section>
    </main>
  );
}
