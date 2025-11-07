import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


export default function FAQs() {
  const accordionItems = [
    {
      value: '1',
      question: 'What products does yozoon provide?',
      answer: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      value: '2',
      question: 'How to trade cryptocurrencies on yozoon',
      answer:
        "Yes. It comes with default styles that match the other components' aesthetic.",
    },
    {
      value: '3',
      question: 'How to track cryptocurrency prices',
      answer:
        "Yes. It's animated by default, but you can disable it if you prefer.",
    },
    {
      value: '4',
      question: 'How to buy Bitcoin and other cryptocurrencies on Binance',
      answer:
        "Yes. It's animated by default, but you can disable it if you prefer.",
    },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-5">
      <h1 className="uppercase mb-5 md:mb-10 sofia-fonts font-[700] text-[16px] md:text-[28px] text-center dark:text-[#FFFFFF] text-black">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full ">
        {accordionItems.map((item) => (
          <AccordionItem className='md:text-xl' key={item.value} value={item.value}>
            <AccordionTrigger className='text-sm md:text-lg font-medium'>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
