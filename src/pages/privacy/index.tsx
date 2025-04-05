// app/privacy/page.tsx (Next.js App Router)
// or pages/privacy.tsx (Pages Router)

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">
        Effective Date: April 5, 2025
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Overview</h2>
        <p>
          At <strong>Lost.Finance</strong>, we value transparency and privacy.
          This platform reports on crypto-related crimes using{" "}
          <strong>public and verifiable sources only</strong>. We do{" "}
          <strong>not</strong> collect, store, or track any personal
          information.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">2. Public Information Only</h2>
        <p>All data on Lost.Finance is sourced from:</p>
        <ul className="list-disc list-inside">
          <li>Public blockchain data</li>
          <li>Verified news reports</li>
          <li>Court filings</li>
          <li>Official agency reports</li>
        </ul>
        <p>
          We do <strong>not</strong> store or display any private or sensitive
          personal data.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">3. No Tracking or Analytics</h2>
        <p>
          We do <strong>not</strong> use:
        </p>
        <ul className="list-disc list-inside">
          <li>Cookies</li>
          <li>Analytics tools</li>
          <li>User tracking scripts</li>
          <li>Behavioral profiling</li>
          <li>Account systems or logins</li>
        </ul>
        <p>You can browse Lost.Finance completely anonymously.</p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">4. Open Source Code</h2>
        <p>
          Lost.Finance is an open-source project. You can view and contribute to
          the source code here:{" "}
          <a
            href="https://github.com/dvncan/lost.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            github.com/dvncan/lost.finance
          </a>
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">
          5. Smart Contract Transparency
        </h2>
        <p>
          We use a publicly deployed Ethereum smart contract to store and verify
          reports. You can review the verified source code on Sepolia Etherscan:
        </p>
        <a
          href="https://sepolia.etherscan.io/address/0xee5085d66fe9d6dd3a52c9197ebc526b730cabb0#code"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          0xee5085d66fe9d6dd3a52c9197ebc526b730cabb0
        </a>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">6. Third-Party Links</h2>
        <p>
          We may reference or link to third-party websites. We are not
          responsible for their privacy practices—please consult their policies
          individually.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">7. No Data Stored</h2>
        <p>We do not:</p>
        <ul className="list-disc list-inside">
          <li>Host user accounts</li>
          <li>Store personal data</li>
          <li>Log user activity</li>
        </ul>
        <p>Our backend is stateless in regard to user interactions.</p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">8. Policy Changes</h2>
        <p>
          We will update this page if our practices ever change. Any future
          features involving data will be opt-in and clearly disclosed.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">9. Contact</h2>
        <p>
          For questions or concerns, contact us at:{" "}
          <a href="mailto:your@email.com" className="text-blue-600 underline">
            your@email.com
          </a>
        </p>
      </section>
    </main>
  );
}
