
import PaymentsSection from "@/components/table/payments/PaymentsSection"
import SectionBar from "@/components/ui/sectionBr"


const page = () => {
     return (
          <section className="p-5">
               <SectionBar
                    title="Payments"
                    description="Track your payments, monitor transactions, and manage your business finances."
               />
               <PaymentsSection />
          </section>
     )
}

export default page