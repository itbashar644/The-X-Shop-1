import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  FaShippingFast, 
  FaShieldAlt, 
  FaHandshake, 
  FaGlobeAsia, 
  FaBoxOpen,
  FaRocket,
  FaChartLine,
  FaUsers
} from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const stats = [
    { value: "5+", label: "Лет на рынке", icon: <FaChartLine /> },
    { value: "10K+", label: "Довольных клиентов", icon: <FaUsers /> },
    { value: "500+", label: "Товаров в ассортименте", icon: <FaBoxOpen /> },
    { value: "95%", label: "Положительных отзывов", icon: <IoDiamond /> }
  ];

  const advantages = [
    {
      icon: <FaShippingFast />,
      title: "Быстрая доставка",
      description: "Отправка товаров в течение 24 часов после заказа"
    },
    {
      icon: <FaShieldAlt />,
      title: "Гарантия качества",
      description: "Все товары проходят тщательную проверку перед отправкой"
    },
    {
      icon: <FaHandshake />,
      title: "Прямые поставки",
      description: "Работаем напрямую с производителями без посредников"
    },
    {
      icon: <FaGlobeAsia />,
      title: "По всей России",
      description: "Доставляем в любой регион удобным для вас способом"
    },
    {
      icon: <FaBoxOpen />,
      title: "Широкий ассортимент",
      description: "Более 500 позиций электроники и товаров для дома"
    }
  ];

  // Создаем частицы для фона
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 80 + 10;
      particles.push(
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 backdrop-blur-sm"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    }
    return particles;
  };

  // Анимация волны
  const WaveDivider = () => (
    <div className="relative h-24 -mt-24 overflow-hidden">
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute top-0 left-0 w-full h-full"
      >
        <motion.path 
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          fill="#0f172a"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          fill="#0f172a"
          opacity="0.5"
        />
        <path 
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          fill="#0f172a"
          opacity="0.7"
        />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-gray-200 overflow-x-hidden">
      {/* Анимированный фон */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-cyan-500/[0.03] bg-[length:60px_60px]"></div>
        {createParticles()}
        
        {/* Декоративные элементы */}
        <div className="absolute top-1/4 left-[5%] w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-[10%] w-64 h-64 rounded-full bg-blue-600/15 blur-[80px]"></div>
      </div>
      
      <Navbar />
      
      {/* Герой-секция */}
      <div className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span className="block">Инновации</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Страсть</span>
                  <span className="block">Доверие</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-blue-200 mb-10 max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  The X Shop — ваш проводник в мире качественных китайских товаров. 
                  Мы создаем мост между передовыми технологиями и российскими покупателями.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link 
                    to="/catalog" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium py-4 px-8 rounded-full transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:gap-4 group"
                  >
                    <span>Исследовать каталог</span>
                    <FaRocket className="group-hover:animate-pulse transition-all" />
                  </Link>
                </motion.div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative">
                  {/* Анимированная рамка */}
                  <motion.div 
                    className="absolute -inset-4 border-2 border-cyan-500/30 rounded-3xl"
                    animate={{
                      borderWidth: [2, 3, 2],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity
                    }}
                  />
                  
                  {/* Основной блок */}
                  <div className="relative bg-gradient-to-br from-blue-900/40 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-700/30 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-cyan-200 mb-6">The X Shop в цифрах</h2>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            className="bg-blue-900/30 backdrop-blur-sm rounded-xl p-5 border border-blue-700/30 hover:border-cyan-400/50 transition-all"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.15 }}
                            whileHover={{ y: -8 }}
                          >
                            <div className="text-cyan-300 mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-cyan-300">{stat.value}</div>
                            <div className="text-sm mt-1 text-blue-200">{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <WaveDivider />
      </div>

      <main className="relative z-10">
        {/* Секция с преимуществами */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <motion.h2 
                className="text-4xl font-bold mb-6 text-cyan-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">преимущества</span>
              </motion.h2>
              
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              ></motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.7 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="relative bg-blue-900/30 backdrop-blur-sm p-8 rounded-2xl border border-blue-700/30 group-hover:border-cyan-400/50 transition-all h-full">
                    <motion.div 
                      className="text-cyan-300 mb-5 text-4xl"
                      whileHover={{ 
                        rotate: [0, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {advantage.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-200">{advantage.title}</h3>
                    <p className="text-blue-100">{advantage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Секция "О компании" */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
              <motion.div 
                className="lg:w-2/5"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/30 backdrop-blur-sm w-full aspect-[4/5] rounded-2xl border-2 border-blue-700/30 overflow-hidden" />
                  
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-xl z-[-1] animate-pulse"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl z-[-1] rotate-12"></div>
                </div>
              </motion.div>
              
              <div className="lg:w-3/5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-sm font-medium py-1 px-4 rounded-full mb-6">
                    Наша история
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-8 text-cyan-200">
                    От маленького стартапа до лидера рынка
                  </h2>
                  
                  <div className="space-y-6 text-blue-100">
                    <p className="text-lg leading-relaxed">
                      Компания <span className="font-semibold text-cyan-300">The X Shop</span> начала свой путь 5 лет назад с небольшой команды энтузиастов. 
                      Сегодня мы стали надежным партнером для тысяч покупателей по всей России.
                    </p>
                    
                    <p className="leading-relaxed">
                      Наше прямое сотрудничество с производителями позволяет предлагать клиентам 
                      качественные товары по доступным ценам без лишних наценок.
                    </p>
                    
                    <div className="bg-blue-900/40 backdrop-blur-sm p-6 rounded-xl border border-blue-700/30 mt-8">
                      <blockquote className="italic text-lg border-l-4 border-cyan-400 pl-4 py-2">
                        "Наша миссия — сделать качественные китайские товары доступными для каждого россиянина, 
                        обеспечивая при этом высокий уровень сервиса и поддержки."
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Секция с призывом к действию */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="bg-gradient-to-br from-cyan-900/20 to-blue-900/30 backdrop-blur-xl rounded-[40px] p-12 text-center border-2 border-blue-700/30 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6 text-cyan-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Готовы сделать заказ или у вас есть вопросы?
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-blue-200 mb-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Наша команда всегда готова помочь с выбором и ответить на любые вопросы
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to="/catalog" 
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-4 px-10 rounded-full transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03]"
                  >
                    Перейти в каталог
                  </Link>
                  <Link 
                    to="/contacts" 
                    className="inline-block bg-transparent border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 font-medium py-4 px-10 rounded-full transition-all hover:scale-[1.03]"
                  >
                    Связаться с нами
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Принципы работы */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <motion.h2 
                className="text-4xl font-bold mb-6 text-cyan-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">принципы</span> работы
              </motion.h2>
              
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              ></motion.div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  "Качество превыше всего - каждый товар проходит многоэтапную проверку",
                  "Прозрачность - никаких скрытых платежей и условий",
                  "Поддержка 24/7 - наша служба поддержки всегда на связи",
                  "Гибкие условия - различные способы оплаты и доставки"
                ].map((principle, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start bg-blue-900/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-700/30"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 mt-1 mr-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="text-blue-100">{principle}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center mt-16 text-blue-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="mb-4">
                  Остались вопросы? Изучите раздел{" "}
                  <Link to="/delivery" className="text-cyan-300 hover:underline font-medium">
                    Доставка
                  </Link>{" "}
                  или свяжитесь с нами через страницу{" "}
                  <Link to="/contacts" className="text-cyan-300 hover:underline font-medium">
                    Контакты
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;