#!/usr/bin/env ruby
#
# Check for changed posts

Jekyll::Hooks.register :posts, :post_init do |post|

  next unless File.directory?(File.join(post.site.source, '.git'))

  commit_num = `git rev-list --count HEAD "#{ post.path }" 2>#{ File::NULL }`

  if commit_num.to_i > 1
    lastmod_date = `git log -1 --pretty="%ad" --date=iso "#{ post.path }" 2>#{ File::NULL }`
    post.data['last_modified_at'] = lastmod_date unless lastmod_date.empty?
  end

end
