function Home() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to My Portfolio
            </h1>
            <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
              Showcasing my work and skills in web development
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-gray-700 text-center">
          Home page content will be placed here.
        </p>
      </div>
    </div>
  );
}

export default Home;