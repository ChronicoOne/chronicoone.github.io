from lxml import etree
from os.path import exists, join, split
from pathlib import Path
# ! Globals
site_title = "Chronico.One"
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
                 All inquiries can be directed to chronicobusiness@gmail.com."""

# !! Icons
gorbu_svg = "svg/gorbu_head_original.svg"
gorbu_fav = "img/gorbu_favicon.png"
nav_button_svg = "svg/navbutton.svg"

# !! Scripts
nav_js = "scripts/nav.js"

# !!! navicon : (name, filename)
navicons = ["Home",
            "Projects",
            "Tutorials",
            "Games",
            "GitHub"]

# ! Functions

# !! active_icon: filepath -> navicon
# !! returns the navicon that should be active on the page at filepath

def active_icon(filepath):
    dirs = Path(filepath).parts
    if len(dirs) > 1:
        for icon in navicons:
            if icon.lower() == dirs[0].lower():
                return icon
    else:
        return "Home"
    
# !! homepath : filepath -> String
# !! returns the relative path to the site home directory
def homepath(filepath):
    dirs = Path(filepath).parts
    pagepath = ""
    for i in range(len(dirs) - 1):
        pagepath += '../'
    return pagepath
    
# !! githubpath : filepath -> String 
# !! returns link to the given page on GitHub

def githubpath(filepath):
    return github_link + filepath
    
# !! navpagepath : filepath navicon -> filepath
# !! returns the relative path to the navicon's page 
def navpagepath(path, navicon):
    dirs = split(path)
    dirs = [part for part in dirs if part != '']
    pagepath = homepath(path)
    if navicon == "Home":
        pagepath += "index.html"
    elif navicon == "GitHub":
        pagepath = githubpath("/".join(dirs[:-1]))
    else:
        pagepath += navicon.lower() + "/" + navicon.lower() + ".html"
    return pagepath
    
# !! svgpath : filepath navicon -> filepath
# !! returns the relative path to the navicon's svg
def svgpath(path, navicon):
    return homepath(path) + "svg/" + navicon.lower() + ".svg"

# !! build_page : filepath etree -> etree
# !! returns an etree with Chronico formatting given the main article as an etree
def build_page(path, main_article):
    page_head = list(main_article)[0].text
    page_desc = list(main_article)[1].text
    
    # html
    html = etree.Element("html")
    html.set("lang", lang)

    ## head
    head = etree.SubElement(html, "head")

    ### title 
    title = etree.SubElement(head, "title")
    title.text = page_head + " - " + site_title
    
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
    meta_desc.set("content", page_desc)

    ### link stylesheet
    link_style = etree.SubElement(head, "link")
    link_style.set("rel", "stylesheet")
    link_style.set("href", homepath(path) + "styles/" + stylesheet)
    
    ### link favicon
    link_icon = etree.SubElement(head, "link")
    link_icon.set("rel", "icon")
    link_icon.set("href", homepath(path) + gorbu_fav)
    
    ### script nav.js
    script_nav = etree.SubElement(head, "script")
    script_nav.set("defer", "")
    script_nav.set("src", homepath(path) + nav_js)
    
    ## body
    body = etree.SubElement(html, "body")

    ### nav
    nav = etree.SubElement(body, "nav")
    
    #### ul
    nav_ul = etree.SubElement(nav, "ul")

    for icon in navicons:
        li = etree.SubElement(nav_ul, "li")
        a = etree.SubElement(li, "a")
        if icon == active_icon(path):
            a.set("class", "active")
        a.set("href", navpagepath(path, icon))
        img = etree.SubElement(a, "img")
        img.set("src", svgpath(path, icon))
        if icon == "GitHub":
            a.set("target", "_blank")
            a.set("rel", "noopener noreferrer")
        img.tail = icon
    
    ##### li
    nav_ul_li = etree.SubElement(nav_ul, "li")
    
    ##### div
    nav_ul_li_div = etree.SubElement(nav_ul_li, "div")
    nav_ul_li_div.set("class", "dir")
    
    ###### p
    nav_ul_li_div_p = etree.SubElement(nav_ul_li_div, "p")
    nav_ul_li_div_p.set("id", "pwd")
    nav_ul_li_div_p.text = "/" + split(path)[-1]
    
    ### header
    header = etree.SubElement(body, "header")

    #### h1
    header_h1 = etree.SubElement(header, "h1")
    header_h1.text = header_text
    
    #### img (nav toggle button)
    header_img = etree.SubElement(header, "img")
    header_img.set("src", homepath(path) + nav_button_svg)
    header_img.set("id", "nav_button")
    header_img.set("onclick", "toggleNav()")

    #### a
    header_a = etree.SubElement(header, "a")
    header_a.set("href", gorbu_path)

    ##### img
    header_a_img = etree.SubElement(header_a, "img")
    header_a_img.set("src", homepath(path) + gorbu_svg)
    header_a_img.set("class", "logo_main")

    ### main
    main = etree.SubElement(body, "main")

    #### article
    main.append(main_article)
    
    ### footer
    footer = etree.SubElement(body, "footer")

    #### p

    footer_p = etree.SubElement(footer, "p")
    footer_p.text = footer_text
    
    return html

