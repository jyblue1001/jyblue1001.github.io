# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.1"
gem "html-proofer", "~> 5.0", group: :test
gem "logger"  # Add logger gem to prevent warnings in Ruby 3.5.0

gem "csv"        # Add CSV to avoid deprecation warnings
gem "base64"     # Add Base64 to avoid deprecation warnings

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", ">= 0.1.0", platforms: [:mingw, :x64_mingw, :mswin]
