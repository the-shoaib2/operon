export default function AppNameSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem] font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              OPERONE
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground max-w-4xl mx-auto">
            The Ultimate Development Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
            <span className="text-sm sm:text-base text-muted-foreground uppercase tracking-widest font-semibold">
              Built for Developers
            </span>
            <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
