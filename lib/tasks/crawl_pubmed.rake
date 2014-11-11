namespace :pubmed do
  desc "index pubmed journals"
  task :index => :environment do
    journals = [
      "Behavioral and Brain Sciences",
      "Brain and Cognition",
      "Cerebral Cortex",
      "Cognitive Systems Research",
      "Cognitive, Affective, & Behavioral Neuroscience",
      "Cortex",
      "Emotion",
      "Journal of Cognitive Neuroscience",
      "Journal of Experimental Psychology",
      "Journal of Memory and Language",
      "Journal of Neuroscience, Psychology, and Economics",
      "Neural Computation (journal)",
      "Neuropsychologia",
      "Perceptual and Motor Skills",
      "Trends in Cognitive Science"
    ]

    #years = ["2009", "2010", "2011", "2012", "2013", "2014"]
    years = ["2014"]

    journals.each do |journal|
      years.each do |year|
        Pubmed.new(
          journal,
          year
        ).crawl
      end
    end
  end
end
