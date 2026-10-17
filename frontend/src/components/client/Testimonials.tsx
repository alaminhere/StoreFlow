import Card from '../ui/card';
import Avatar from '../shared/Avatar';
import RatingGenerator from '@/helpers/RatingGenerator';

const TESTIMONIALS = [
  {
    name: 'Ahmed Rahman',
    details: 'Owner, TechMart BD',
    rating: 4,
    content:
      'Stockpile transformed how we manage inventory. We went from spreadsheet chaos to real-time tracking across 3 warehouses. The POS system alone saved us 10 hours a week.',
  },
  {
    name: 'Hafiza Rahman',
    details: 'CEO, Crochet & Sewing Ideas',
    rating: 5,
    content:
      'The invoicing feature is incredible. Professional invoices with our logo, automatic tax calculation, and customers can pay via bKash directly. Game changer.',
  },
  {
    name: 'Mohammed Yusuf',
    details: 'Director, GlobalTrade',
    rating: 4,
    content:
      'We manage 2,000+ products across 4 warehouses. Stockpile handles it flawlessly. The analytics dashboard gives us insights we never had before.',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials">
      <div className="app-container pb-20">
        <div>
          <p className="animate-slide-up mb-2 uppercase text-primary font-medium">
            Testimonials
          </p>
          <h2 className="animate-slide-up">Trusted Across Bangladesh</h2>
          <p className="animate-slide-up mt-1 w-full md:w-[50%]">
            See what our customers have to say about Stockpile.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(item => (
            <Card key={item.name} className="bg-primary-fade">
              <span className="flex items-center gap-2 mb-3">
                {RatingGenerator(item.rating)}
              </span>
              <p className="p14 mb-5">{item.content}</p>
              <Avatar name={item.name} details={item.details} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
