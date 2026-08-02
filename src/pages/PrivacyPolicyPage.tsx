import { LegalLayout } from '../components/LegalLayout'

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updatedAt="2 August 2026"
      intro="CareerShelf (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices you have. It applies to everyone who visits our website, creates an account, or purchases our digital products."
      sections={[
        {
          title: 'Information We Collect',
          children: (
            <>
              <p>
                We collect only the information needed to run our store and
                deliver our products to you:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-gray-700">
                    Account information:
                  </span>{' '}
                  your name and email address when you create an account. Your
                  password is stored securely as a hashed credential by our
                  authentication provider and is never visible to us.
                </li>
                <li>
                  <span className="font-medium text-gray-700">
                    Purchase history:
                  </span>{' '}
                  records of the digital products you purchase, the order
                  amount, the date of purchase, and the payment status.
                </li>
                <li>
                  <span className="font-medium text-gray-700">
                    Communications:
                  </span>{' '}
                  the content of messages you send us through the contact form
                  or by email.
                </li>
                <li>
                  <span className="font-medium text-gray-700">
                    Basic usage information:
                  </span>{' '}
                  technical details such as your browser type and device, used
                  solely to keep the website working and secure.
                </li>
              </ul>
              <p>
                We do <span className="font-medium text-gray-700">not</span>{' '}
                collect or store your debit or credit card numbers. Card
                payments are processed entirely by our payment partner,
                Razorpay, under its own terms and privacy policy.
              </p>
            </>
          ),
        },
        {
          title: 'How We Use Your Information',
          children: (
            <>
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Create and manage your account;</li>
                <li>Process and deliver your digital product orders;</li>
                <li>Provide access to your purchase library and downloads;</li>
                <li>Respond to your questions and support requests;</li>
                <li>
                  Send you important service communications (such as order
                  confirmations and payment receipts); and
                </li>
                <li>Comply with our legal and regulatory obligations.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Payment Processing',
          children: (
            <p>
              Payments on this website are processed by Razorpay Software
              Private Limited, a payment aggregator authorised by the Reserve
              Bank of India. When you pay, you are dealing directly with
              Razorpay, and your card details are handled by them in accordance
              with applicable PCI DSS requirements. We receive only the payment
              status and basic order details needed to complete your purchase.
            </p>
          ),
        },
        {
          title: 'Sharing of Your Information',
          children: (
            <p>
              We never sell, rent, or trade your personal information to third
              parties. We share information only with the service providers we
              rely on to operate the store — such as our hosting and database
              provider (Supabase) and our payment processor (Razorpay) — and
              only to the extent necessary to provide our services to you. We
              may also disclose information where required by law, or to
              protect our rights, safety, and the integrity of our services.
            </p>
          ),
        },
        {
          title: 'Data Retention and Security',
          children: (
            <p>
              We retain your account information and purchase history for as
              long as your account is active and as long as needed for legal,
              accounting, and tax purposes. We use industry-standard technical
              and organisational safeguards — including secure connections,
              encrypted data in transit, and access controls — to protect your
              information against unauthorised access, alteration, or loss.
              However, no method of transmission or storage is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          ),
        },
        {
          title: 'Your Rights',
          children: (
            <>
              <p>
                You have the right to access, correct, update, or delete the
                personal information we hold about you. You can update your
                profile information from your account dashboard, and you may
                contact us at any time to request a copy of your data, to have
                inaccuracies corrected, or to have your account and personal
                information deleted.
              </p>
              <p>
                These rights are in line with the Digital Personal Data
                Protection Act, 2023 (DPDP Act) and other applicable Indian
                data protection law. If you have a complaint about how we
                handle your data, please contact us first so we can resolve it,
                and you may also complain to the Data Protection Board of India.
              </p>
            </>
          ),
        },
        {
          title: 'Cookies and Analytics',
          children: (
            <p>
              We use essential cookies and similar technologies required for
              authentication and for the website to function correctly. We do
              not currently use third-party advertising cookies. Any analytics
              we enable in the future will be used in aggregate to understand
              how the website is used and will not identify you personally.
            </p>
          ),
        },
        {
          title: "Children's Privacy",
          children: (
            <p>
              Our services and products are intended for adults who are at
              least 18 years of age or have the legal capacity to contract
              under Indian law. We do not knowingly collect personal
              information from children. If you believe a child has provided us
              with personal information, please contact us and we will delete
              it promptly.
            </p>
          ),
        },
        {
          title: 'Changes to This Policy',
          children: (
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the &quot;Last updated&quot; date at the top of
              this page and post the updated policy here. Continued use of the
              website after changes take effect constitutes acceptance of the
              revised policy.
            </p>
          ),
        },
        {
          title: 'Contact Us',
          children: (
            <p>
              If you have any questions about this Privacy Policy or how we
              handle your data, please email us at{' '}
              <a
                href="mailto:hello@careershelf.co"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                hello@careershelf.co
              </a>
              . We aim to respond to all privacy requests within 24 hours on
              weekdays.
            </p>
          ),
        },
      ]}
    />
  )
}
