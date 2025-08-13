
import React from 'react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Прямые поставки",
      description: "Мы работаем напрямую с производителями из Китая, минуя посредников"
    },
    {
      title: "Контроль качества",
      description: "Каждый товар проходит проверку перед отправкой клиенту"
    },
    {
      title: "Гарантия",
      description: "Мы предоставляем гарантию на все товары и возможность возврата"
    }
  ];

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-12">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
