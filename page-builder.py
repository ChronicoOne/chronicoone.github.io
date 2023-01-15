from lxml import etree

# ! Globals
github_link = "https://github.com/ChronicoOne/chronicoone.github.io/tree/master/"
gorbu_path = "#top"
doctype = b"<!DOCTYPE html>\n"
lang = "en-US"
charset = "UTF-8"
vp_width = "device-width"
initial_scale = "1.0"
stylesheet = "main.css"
author = "Connor Bowman"

# !! Page Text
header_text = "Chronico.One"
footer_text = """Chronico.One is independently managed and developed by Connor Bowman.
                 All business inquiries can be directed to chronicobusiness@gmail.com."""
# !! Page Dependent
path = "index.html"
description = "Chronico One is a source for technological insight and captivating projects."
page_title = "Chronico.One"
active_zone = "Home"

# !! Icons
gorbu_svg = "svg/gorbu_head_original.svg"

# !!! navicon : (name, filename)
navicons = ["Home",
            "Projects",
            "Tutorials",
            "Games",
            "GitHub"]

# ! Functions

# !! active_status: navicon -> String
# !! returns "active" when navicon is active and "" otherwise

def active_status(navicon):
    if navicon == active_zone:
        return "active"
    else:
        return ""

# !! homepath : filepath -> String
# !! returns the relative path to the site home directory
def homepath(filepath):
    dirs = filepath.split("/")
    pagepath = ""
    for i in range(len(dirs) - 1):
        pagepath += '../'
    return pagepath
    
# !! githubpath : filepath -> String 
# !! returns link to the given page on GitHub

def githubpath(filepath):
    return github_link + filepath
    
# !! navpagepath : navicon -> String
# !! returns the relative path to the navicon's page 
def navpagepath(navicon):
    dirs = path.split("/")
    pagepath = ""
    for i in range(len(dirs) - 1):
        pagepath += '../'
    if navicon == "Home":
        pagepath += "index.html"
    elif navicon == "GitHub":
        pagepath = githubpath("/".join(dirs[:-1]))
    else:
        pagepath += navicon.lower() + "/" + navicon.lower() + ".html"
    return pagepath
    
# !! navsvgpath : navicon -> String
# !! returns the relative path to the navicon's svg
def navsvgpath(navicon):
    svgpath = homepath(path) + "svg/" + navicon.lower() + ".svg"
    return svgpath
    
# !!! Element tree 

def build_page(path, 
               page_head_text,
               page_desc_text, 
               navicons=navicons, 
               stylesheet=stylesheet):
    # html
    html = etree.Element("html")
    html.set("lang", lang)

    ## head
    head = etree.SubElement(html, "head")

    ### title 

    title = etree.SubElement(head, "title")
    title.text = page_title

    ### meta charset
    meta_char = etree.SubElement(head, "meta")
    meta_char.set("charset", charset)

    ### meta viewport
    meta_vp = etree.SubElement(head, "meta")
    meta_vp.set("name", "viewport")
    meta_vp.set("content", "width=" + vp_width + ", " + "initial-scale=" + initial_scale) 

    ### meta author
    meta_author = etree.SubElement(head, "meta")
    meta_author.set("name", "author")
    meta_author.set("content", author)

    ### meta description
    meta_desc = etree.SubElement(head, "meta")
    meta_desc.set("name", "description")
    meta_desc.set("content", description)

    ### link stylesheet
    link_style = etree.SubElement(head, "link")
    link_style.set("rel", "stylesheet")
    link_style.set("href", homepath(path) + "styles/" + stylesheet)

    ## body
    body = etree.SubElement(html, "body")

    ### nav
    nav = etree.SubElement(body, "nav")

    #### ul
    ul_nav = etree.SubElement(nav, "ul")

    for icon in navicons:
        li = etree.SubElement(ul_nav, "li")
        a = etree.SubElement(li, "a")
        a.set("class", active_status(icon))
        a.set("href", navpagepath(icon))
        img = etree.SubElement(a, "img")
        img.set("src", navsvgpath(icon))
        if icon == "GitHub":
            a.set("target", "_blank")
            a.set("rel", "noopener noreferrer")
        img.tail = icon
    
    ### header
    header = etree.SubElement(body, "header")

    #### h1
    header_h1 = etree.SubElement(header, "h1")
    header_h1.text = header_text

    #### a
    header_a = etree.SubElement(header, "a")
    header_a.set("href", gorbu_path)

    ##### img
    header_img = etree.SubElement(header_a, "img")
    header_img.set("src", homepath(path) + gorbu_svg)
    header_img.set("class", "logo_main")

    ### main
    main = etree.SubElement(body, "main")

    #### article

    main_article = etree.SubElement(main, "article")

    ##### h1
    main_article_h1 = etree.SubElement(main_article, "h1")
    main_article_h1.set("class", "page-head")
    main_article_h1.text = page_head_text

    ##### p
    main_article_p = etree.SubElement(main_article, "p")
    main_article_p.set("class", "page-desc")
    main_article_p.text = page_desc_text
    
    ### footer
    footer = etree.SubElement(body, "footer")

    #### p

    footer_p = etree.SubElement(footer, "p")
    footer_p.text = footer_text

    # ! Write ElementTree to file
    etree.indent(html)

    html_doc = etree.tostring(html, method="html", pretty_print=True)

    print(html_doc)

    f_html = open(path, 'wb')

    f_html.write(doctype + html_doc)

    f_html.close()