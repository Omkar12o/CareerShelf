import { LegalLayout } from '../components/LegalLayout'

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updatedAt="2 August 2026"
      intro="These Terms of Service (&quot;Terms&quot;) govern your use of the CareerShelf website and the purchase and use of our digital products. By accessing the website or creating an account, you agree to be bound by these Terms. If you do not agree, please do not use the website or purchase our products."
      sections={[
        {
          title: 'Acceptance of These Terms',
          children: (
            <p>
              By browsing this website, creating an account, or purchasing any
              product, you confirm that you are at least 18 years old (or have
              the legal capacity to contract under Indian law) and that you
              agree to these Terms and our Privacy Policy.
            </p>
          ),
        },
        {
          title: 'Description of Services',
          children: (
            <p>
              CareerShelf sells digital products — including ebooks, guides,
              templates, question sets, contact lists, referral resources, and
              consultancy services — intended to help job seekers research,
              prepare, and apply for roles. All products are delivered
              electronically, and consultancy services, where applicable, are
              provided as scheduled calls.
            </p>
          ),
        },
        {
          title: 'Accounts and Your Responsibilities',
          children: (
            <>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activity that occurs under your
                account. You agree to:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide accurate, current, and complete information;</li>
                <li>
                  Keep your email address up to date, as it is used to deliver
                  your purchases and important notices;
                </li>
                <li>
                  Notify us promptly if you suspect any unauthorised use of
                  your account; and
                </li>
                <li>
                  Accept responsibility for all purchases and activity made
                  under your account.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'Digital Products — License and Personal Use',
          children: (
            <>
              <p>
                When you purchase a digital product, we grant you a limited,
                non-exclusive, non-transferable licence to use that product
                for your own personal, non-commercial purposes. This means you
                may:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Download and store the product for your own use;</li>
                <li>Print or annotate it for your own use; and</li>
                <li>Apply the guidance and templates to your own work.</li>
              </ul>
              <p>
                You may <span className="font-medium text-gray-700">not</span>:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Resell, sublicense, rent, lend, or otherwise redistribute the
                  product to any third party, whether for free or for profit;
                </li>
                <li>
                  Share the product, its downloads, or your account access with
                  other people or on any public platform;
                </li>
                <li>
                  Reproduce, copy, or republish the product&apos;s content in
                  whole or in part without our written permission; or
                </li>
                <li>
                  Use the product to build competing products or services.
                </li>
              </ul>
              <p>
                We may monitor for unauthorised redistribution. A violation of
                this clause is a material breach of these Terms and may result
                in termination of your access, cancellation of your purchases,
                and liability for damages.
              </p>
            </>
          ),
        },
        {
          title: 'Prohibited Conduct',
          children: (
            <>
              <p>While using the website, you agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Use the website for any unlawful purpose or in a way that
                  violates these Terms;
                </li>
                <li>
                  Attempt to interfere with, disrupt, or gain unauthorised
                  access to the website, its servers, or our systems;
                </li>
                <li>
                  Scrape, harvest, or collect data from the website without
                  permission;
                </li>
                <li>
                  Create accounts through automated means or use multiple
                  accounts to circumvent purchase limits or our refund policy;
                  or
                </li>
                <li>
                  Misuse payment processing, including initiating chargebacks
                  in bad faith.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'Payment, Pricing, and Taxes',
          children: (
            <>
              <p>
                All prices are listed in Indian Rupees (INR). Payment is
                collected upfront through Razorpay, our payment gateway
                provider. By completing a purchase, you authorise the charge to
                your chosen payment method.
              </p>
              <p>
                We may change prices or adjust product listings at any time.
                Prices shown at the time of checkout are the prices you pay;
                changes never apply retroactively to completed orders.
              </p>
            </>
          ),
        },
        {
          title: 'Refunds and Cancellations',
          children: (
            <p>
              Our refund and cancellation policy is set out in full on our{' '}
              <a
                href="/refunds"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Refund Policy
              </a>{' '}
              page, which forms part of these Terms. In summary, all sales of
              digital products are final unless the product is significantly
              not as described, in which case you may request a refund within
              30 days of purchase.
            </p>
          ),
        },
        {
          title: 'Intellectual Property',
          children: (
            <p>
              The website and all products sold on it — including text,
              graphics, layouts, templates, and compilations — are our
              intellectual property or the property of our licensors and are
              protected under the Copyright Act, 1957 and other applicable
              Indian laws. All rights not expressly granted in these Terms are
              reserved to us.
            </p>
          ),
        },
        {
          title: 'Third-Party Links and Services',
          children: (
            <p>
              The website may link to third-party websites or services (such as
              Razorpay). We are not responsible for the content, policies, or
              practices of any third-party service. Your use of such services
              is subject to their own terms and privacy policies.
            </p>
          ),
        },
        {
          title: 'Disclaimer of Warranties',
          children: (
            <p>
              Our products are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, whether express
              or implied, including implied warranties of merchantability or
              fitness for a particular purpose. While we strive for accuracy,
              we do not guarantee that any product, strategy, or information
              will result in a job offer, interview, or any specific outcome.
              Career outcomes depend on factors beyond our control.
            </p>
          ),
        },
        {
          title: 'Limitation of Liability',
          children: (
            <p>
              To the maximum extent permitted by law, our total liability to
              you arising out of or in connection with these Terms or your use
              of the website and products will not exceed the amount you paid
              for the specific product giving rise to the claim. We will not be
              liable for any indirect, incidental, special, or consequential
              damages, including lost profits or lost opportunities, whether
              arising in contract, tort, or otherwise.
            </p>
          ),
        },
        {
          title: 'Governing Law and Jurisdiction',
          children: (
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India. Any dispute arising out of or relating to these
              Terms or your use of the website shall be subject to the
              exclusive jurisdiction of the courts of Pune, Maharashtra, India.
            </p>
          ),
        },
        {
          title: 'Changes to These Terms',
          children: (
            <p>
              We may update these Terms from time to time. Material changes
              will be reflected by updating the &quot;Last updated&quot; date
              at the top of this page. Your continued use of the website after
              changes take effect constitutes acceptance of the revised Terms.
            </p>
          ),
        },
        {
          title: 'Contact Us',
          children: (
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a
                href="mailto:hello@careershelf.co"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                hello@careershelf.co
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
