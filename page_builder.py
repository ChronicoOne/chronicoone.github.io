from lxml import etree
from os.path import exists, join

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
    dirs = filepath.split("/")
    if len(dirs) > 1:
        for icon in navicons:
            if icon.lower() == dirs[0].lower():
                return icon
    else:
        return "Home"
    
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
    
# !! navpagepath : filepath navicon -> filepath
# !! returns the relative path to the navicon's page 
def navpagepath(path, navicon):
    dirs = path.split("/")
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
    nav_ul_li_div_p.text = "/" + path.split("/")[-1]
    
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
    main.append(main_article)
    
    ### footer
    footer = etree.SubElement(body, "footer")

    #### p

    footer_p = etree.SubElement(footer, "p")
    footer_p.text = footer_text
    
    return html

# !! inner_outer : list -> list list
# !! returns a list of script lines inside the element
# !! and a list of script lines outside the element 
# !! given a list of lines of .chronico script
def inner_outer(lines):
    j = 1
    open_count = 1
    while open_count > 0 and j < len(lines):
        if "~" in lines[j]:
            if "\t" in lines[j]:
                open_count += 1
            else:
                open_count -= 1
        j += 1
    return lines[0:j], lines[j:]
        
# !! build_content_head : String -> etree
# !! returns an etree containing containing the main article header given header text
def build_content_head(text_content):
    # h1
    h1 = etree.Element("h1")
    h1.set("class", "page-head")
    h1.text = text_content
    return h1
    
# !! build_content_desc : String -> etree
# !! returns an etree containing the main article description given desc text
def build_content_desc(text_content):
    # desc
    desc = etree.Element("p")
    desc.set("class", "page-desc")
    desc.text = text_content
    return desc

# !! build_content_main : String -> etree
# !! returns an etree to contain the main article content given some text content
# !! Note: text_content should usually be ''
def build_content_main(text_content):
    # div
    div = etree.Element("div")
    div.set("class", "page-body")
    div.text = text_content
    return div

# !! build_content_p : list -> etree
# !! returns an etree containing paragraph content given lines of .chronico script
def build_content_p(text_content):
    # p
    p = etree.Element("p")
    p.text = text_content
    return p

# -- .chronico script function dictionary
chronico_script = {"HEAD~": build_content_head, 
                   "DESC~": build_content_desc,
                   "CONTENT~": build_content_main,
                   "P~": build_content_p}

# !! split_script : String -> ListOfLines
# !! returns a list of script lines given a full script string
def split_script(script):
    lines = script.split('\n')
    lines = [line for line in lines if line != '']
    return lines

# !! single_parse : ListOfLines -> etree 
# !! returns an etree given some lines of .chronico script containing a single element
def single_parse(lines): 
    text_content = ''
    script_key = lines[0].replace('\t', '')
    end_index = len(lines) - 1

    # build inner elements
    inner_elements = []
    inner_start = 1
    while not('~' in lines[inner_start]):
        inner_start += 1
    
    if inner_start < end_index:
        inner_content = lines[inner_start:end_index]
        inner_elements = multi_parse(inner_content)
    
    # build pre-content text for current node
    for i in range(1, inner_start):
        text_content += lines[i]
    text_content = text_content.replace('\t', '')
    
    # build return_etree using chronico script function
    return_etree = chronico_script[script_key](text_content)
    for elem in inner_elements:
        return_etree.append(elem)
        
    return return_etree

# !! count_indent : String -> Integer
# !! returns the number of tabs in a given string
def count_indent(text):
    count = 0
    for char in text:
        if char == '\t':
            count += 1
    return count
    
# !! multi_parse : ListOfLines -> ListOfetrees
# !! returns a list of etrees given some lines of .chronico script containing multiple elements
def multi_parse(lines):
    elements = []
    elem_indices = []
    indent = count_indent(lines[0])
    
    for i in range(len(lines)):
        if '~' in lines[i] and count_indent(lines[i]) == indent:
            elem_indices.append(i)
    
    length = len(elem_indices)
    elem_indices.append(-1)
    for i in range(length // 2):
        tail = ''
        start = elem_indices[2 * i]
        end = elem_indices[(2 * i) + 1]
        element = single_parse(lines[start : end + 1])
        if (2 * i) + 2 < length:
            next_start = elem_indices[(2 * i) + 2]
            if next_start - end > 1:
                for line in lines[end + 2 : next_start]:
                    tail += line.replace('\t', '')
        element.tail = tail
        elements.append(element)
    return elements
    