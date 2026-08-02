import { LegalLayout } from '../components/LegalLayout'

export function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund &amp; Cancellation Policy"
      updatedAt="2 August 2026"
      intro="Because our products are digital and delivered instantly, they cannot be &quot;returned&quot; the way physical goods can. This policy explains when you are eligible for a refund, how to request one, and how long processing takes."
      sections={[
        {
          title: 'Refund Eligibility',
          children: (
            <>
              <p>
                Due to the nature of digital products, all sales are final
                unless the product is significantly not as described. You are
                eligible for a full refund if:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  The product you received is materially different from its
                  description on the website; or
                </li>
                <li>
                  The product is defective or unusable — for example, the
                  download link is broken and cannot be resolved by our
                  support team.
                </li>
              </ul>
              <p>
                Refund requests must be made within{' '}
                <span className="font-medium text-gray-700">30 days</span> of
                the date of purchase. We offer a straightforward 30-day
                money-back guarantee: if a product you purchased is not as
                described or does not work, email us and we will make it right.
              </p>
            </>
          ),
        },
        {
          title: 'Non-Refundable Situations',
          children: (
            <>
              <p>
                A refund will not be issued where the product matches its
                description and functions as intended, including where you:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Purchased the product but no longer want or need it;
                </li>
                <li>
                  Downloaded the product and later changed your mind;
                </li>
                <li>
                  Did not find the content useful, or expected content that
                  was not listed in the product description; or
                </li>
                <li>
                  Purchased on behalf of, or shared access with, another
                  person.
                </li>
              </ul>
              <p>
                Consultancy calls are scheduled for a specific time. If you
                need to reschedule, contact us at least 24 hours before the
                scheduled time. Cancellations received less than 24 hours
                before the call, or after the call has been delivered, are not
                eligible for a refund.
              </p>
            </>
          ),
        },
        {
          title: 'How to Request a Refund',
          children: (
            <>
              <p>
                To request a refund, email us at{' '}
                <a
                  href="mailto:hello@careershelf.co"
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  hello@careershelf.co
                </a>{' '}
                from the email address used to make the purchase. Please include
                the following so we can process your request quickly:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>The product you purchased;</li>
                <li>The date of purchase;</li>
                <li>
                  The order ID or the Razorpay payment ID (found in your
                  receipt email); and
                </li>
                <li>
                  A short description of why the product did not meet its
                  description.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'Processing Time',
          children: (
            <>
              <p>
                Once we receive your request, we will review it within{' '}
                <span className="font-medium text-gray-700">1–2 business days</span>{' '}
                and reply to confirm the decision. If your refund is approved:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  The refund is issued back to the original payment method;
                  and
                </li>
                <li>
                  It will appear in your account within{' '}
                  <span className="font-medium text-gray-700">
                    5–10 business days
                  </span>
                  , depending on your bank or card issuer&apos;s processing
                  times.
                </li>
              </ul>
              <p>
                Refunds can take slightly longer during bank holidays or due to
                delays by payment intermediaries. We are not able to accelerate
                processing once the refund has been initiated.
              </p>
            </>
          ),
        },
        {
          title: 'Chargebacks',
          children: (
            <p>
              Before raising a chargeback or dispute with your bank or payment
              provider, please contact us directly. Most issues can be resolved
              quickly — and we honour our refund policy in full. Initiating a
              chargeback for a purchase that does not qualify for a refund
              under this policy is a breach of our Terms of Service and may
              result in the suspension of your account.
            </p>
          ),
        },
        {
          title: 'Contact Us',
          children: (
            <p>
              Questions about this policy? Email{' '}
              <a
                href="mailto:hello@careershelf.co"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                hello@careershelf.co
              </a>{' '}
              and we&apos;ll help within 24 hours on weekdays.
            </p>
          ),
        },
      ]}
    />
  )
}
