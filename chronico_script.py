from lxml import etree
from page_builder import homepath
from os import listdir
from os.path import isfile, join, dirname, realpath

dir_path = dirname(realpath(__file__))
core_path = join(dir_path, 'core')

# ! script parsing functions

# !! split_script : String -> ListOfLines
# !! returns a list of script lines given a full script string
def split_script(script):
    lines = script.split('\n')
    lines = [line for line in lines if line != '']
    return lines
    
# -- A LinkString is a string that looks like this: 
# --    Link text content goes here`https://www.linkgoeshere.com`

# -- A GameCard is a string that looks like this:
# --    Game Title;Game Description;Game Instructions;Game img path;Game file path;
# -- Paths should be from main site directory

# !! unpack_linkstring : LinkString -> String String
# !! takes a LinkString and breaks it into link and text content
# !! returns a tuple (link, text)
def unpack_linkstring(linkstring):
    package = linkstring.split('`')
    package = [s for s in package if s != '']
    return package[0], package[1]

# !! unpack_gamecard :  GameCard -> String String String String String
# !! takes a GameCard and breaks it into its components:
# !! game title, game description, game img link, and game file link
# !! returns (title, desc, instructions, imgpath, filepath) 
def unpack_gamecard(gamecard):
    out = [text for text in gamecard.split(';') if text != '']
    return (out[0], out[1], out[2], out[3], out[4])

# !! modifiers_parse : ListOfLines -> Dict
# !! returns a dictionary of attributes given a list containing modifier script lines
def modifiers_parse(lines):
    modifier_dict = {}
    for line in lines:
        cleaned = line.replace('\t', '').replace(' ', '').replace("${", "").replace("}",'')
        for attrib in cleaned.split(','):
            if ':' in attrib:
                pair = attrib.split(':')
                modifier_dict[pair[0]] = pair[1]
    return modifier_dict

# !! single_parse : filepath ListOfLines -> etree 
# !! returns an etree given some lines of .chronico script containing a single element
# !! and the relative filepath to the html document
def single_parse(filepath, lines): 
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
        inner_elements = multi_parse(filepath, inner_content)
    
    # parse for element modifier lines
    modifier_start = None
    modifier_end = None
    modifier_dict = {}
    
    for i in range(1, inner_start):
        if "${" in lines[i]:
            modifier_start = i
        if "}" in lines[i] and modifier_start != None:
            modifier_end = i
    
    if modifier_end != None:
        modifier_dict = modifiers_parse(lines[modifier_start:modifier_end + 1])
    
    # build pre-content text for current node
    pretext_start = 1
    if modifier_end != None:
        pretext_start = modifier_end + 1
        
    for i in range(pretext_start, inner_start):
        text_content += lines[i]
    text_content = text_content.replace('\t', '')
      
    # build return_etree using builder function
    return_etree = builder_dict[script_key](filepath, text_content)
    
    #modify return_etree using modifier_dict
    for modifier in modifier_dict:
        return_etree.set(modifier, modifier_dict[modifier])
    
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
    
# !! multi_parse : filepath ListOfLines -> ListOfetrees
# !! returns a list of etrees given some lines of .chronico script containing multiple elements
# !! and the relative filepath to the html document
def multi_parse(filepath, lines):
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
        element = single_parse(filepath, lines[start : end + 1])
        if (2 * i) + 2 < length:
            next_start = elem_indices[(2 * i) + 2]
            if next_start - end > 1:
                for line in lines[end + 1 : next_start]:
                    tail += line.replace('\t', '')
        element.tail = tail
        elements.append(element)
    return elements
    
    
# ! etree builder functions
# ! Take the relative path to the html document and a string of text content 
# ! Return an etree containing a complete element
              
# !! build_content_head : filepath String -> etree
# !! returns an etree containing the main article header given header text
def build_content_head(filepath, text_content):
    # h1
    h1 = etree.Element("h1")
    h1.set("class", "page-head")
    h1.text = text_content
    return h1

# !! get_head_content : filepath -> String
# !! returns a String containing containing the header text of a given .chronico file
def get_head_content(filepath):
    chronico_file = open(filepath)
    lines = split_script(chronico_file.read())
    e_tree = multi_parse('none', lines)
    children = list(e_tree)
    i = 0
    while children[i].get("class") != 'page-head':
        i += 1
        
    return children[i].text
    
# !! build_content_desc : filepath String -> etree
# !! returns an etree containing the main article description given desc text
def build_content_desc(filepath, text_content):
    # desc
    desc = etree.Element("p")
    desc.set("class", "page-desc")
    desc.text = text_content
    return desc

# !! get_desc_content : filepath -> String
# !! returns a String containing containing the description text of a given .chronico file
def get_desc_content(filepath):
    chronico_file = open(filepath)
    lines = split_script(chronico_file.read())
    e_tree = multi_parse('none', lines)
    children = list(e_tree)
    i = 0
    while children[i].get("class") != 'page-desc':
        i += 1
        
    return children[i].text
    
# !! build_content_main : filepath String -> etree
# !! returns an etree to contain the main article content given some text content
# !! Note: text_content should usually be ''
def build_content_main(filepath, text_content):
    # div
    div = etree.Element("div")
    div.set("class", "page-body")
    div.text = text_content
    return div

# !! build_content_p : filepath String -> etree
# !! returns an etree containing paragraph content given text content
def build_content_p(filepath, text_content):
    # p
    p = etree.Element("p")
    p.text = text_content
    return p

# !! build_content_a : filepath LinkString -> etree
# !! returns an etree containing anchor content given a LinkString
def build_content_a(filepath, text_content):
    text, link = unpack_linkstring(text_content)
    # a
    a = etree.Element("a")
    a.set("href", link)
    a.text = text
    return a

# !! build_content_gamecard : filepath GameCard -> etree
# !! returns an etree containing GameCard content given a GameCard
def build_content_gamecard(filepath, text_content):
    title, desc, instructions, imgpath, gamepath = unpack_gamecard(text_content)
    # a
    a = etree.Element("a")
    a.set("class", "card")
    a.set("href", homepath(filepath) + gamepath)
    
    ## div
    div1 = etree.SubElement(a, "div")
    
    ### img
    img = etree.SubElement(div1, "img")
    img.set("class", "card-img")
    img.set("src", homepath(filepath) + imgpath)
    
    ## div
    div2 = etree.SubElement(a, "div")
    
    ### span
    a_span = etree.SubElement(div2, "span")
    a_span.set("class", "card-title")
    a_span.text = title
    
    ### p 
    p1 = etree.SubElement(div2, "p")
    p1.text = desc
    
    ### p 
    p2 = etree.SubElement(div2, "p")
    p2.text = instructions
    
    return a
    
# !! build_content_vid : filepath LinkString -> etree
# !! returns an etree containing video content given a LinkString
def build_content_vid(filepath, text_content):
    text, link = unpack_linkstring(text_content)
    
    # iframe
    iframe = etree.Element("iframe")
    iframe.set("width", "560")
    iframe.set("height", "315")
    iframe.set("src", link)
    iframe.set("class", "vid")
    iframe.set("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture") 
    iframe.set("title", "Youtube video player")
    iframe.set("allowfullscreen", "")
    iframe.set("frameborder", "0")
    
    return iframe
    
# !! get_thumbnail_path : filepath -> String
# !! returns a String containing containing the thumbnail of the main-vid in a given .chronico file
def get_thumbnail_path(filepath):
    chronico_file = open(filepath)
    lines = split_script(chronico_file.read())
    e_tree = multi_parse('none', lines)
    children = list(list(e_tree)[2])
    thumbnail = ""
    
    for child in children:
        if child.get("id") == 'main-vid':
            vid_id = child.get("src").split('/')[-1]
            thumbnail = "https://i.ytimg.com/vi_webp/" + vid_id + "/mqdefault.webp"
    
    return thumbnail

# !! build_articlewidget : filepath ListOfFolders -> etree
# !! returns an etree containing cards of all articles in a given folder
def build_articlewidget(filepath, folder):
    folder_path = join(core_path, folder)
    
    # div
    div = etree.Element("div")
    
    for path in listdir(folder_path):
        if not isfile(join(folder_path, path)):
            for inner_path in listdir(join(folder_path, path)):
                if ".chronico" in inner_path:
                    html_innerpath = inner_path.replace(".chronico", ".html")
                    file_htmlpath = join(homepath(filepath), join(join(folder, path), html_innerpath))
                    file_chronicopath = join(join(folder_path, path), inner_path)
                    
                    head_content = get_head_content(file_chronicopath)
                    desc_content = get_desc_content(file_chronicopath)
                    thumbnail_path = get_thumbnail_path(file_chronicopath)
                    
                    ## a
                    a = etree.SubElement(div, "a")
                    a.set("class", "card")
                    a.set("href", file_htmlpath)
                    
                    ### div
                    div1 = etree.SubElement(a, "div")
                    
                    #### img
                    img = etree.SubElement(div1, "img")
                    img.set("class", "card-img")
                    img.set("src", thumbnail_path)
                    
                    ### div
                    div2 = etree.SubElement(a, "div")
                    
                    #### span
                    a_span = etree.SubElement(div2, "span")
                    a_span.set("class", "card-title")
                    a_span.text = head_content
                    
                    #### p 
                    p1 = etree.SubElement(div2, "p")
                    p1.text = desc_content
    return div 
    
# !! build_content_tutorwidget : filepath String -> etree
# !! returns an etree containing all tutorial cards given filepath
def build_content_tutorwidget(filepath, text_content):
    return build_articlewidget(filepath, "tutorials")

# !! build_content_projectwidget : filepath String -> etree
# !! returns an etree containing all project cards given filepath
def build_content_projectwidget(filepath, text_content):
    return build_articlewidget(filepath, "projects")

# !! build_content_mainwidget : filepath String -> etree
# !! returns an etree containing all content cards given filepath
def build_content_mainwidget(filepath, text_content):
    projects = list(build_articlewidget(filepath, "projects"))
    tutorials = list(build_articlewidget(filepath, "tutorials"))
    game_file = join(join(core_path, "games"), "games.chronico")
    games = list( list( multi_parse(filepath, split_script(open(game_file).read())) )[2] )
    articles = []
    i = 0
    while i < max(len(projects), len(tutorials), len(games)):
        if i < len(projects):
            articles.append(projects[i])
        if i < len(tutorials):
            articles.append(tutorials[i])
        if i < len(games):
            articles.append(games[i])
        i += 1
        
    # div
    div = etree.Element("div")
    for article in articles:
        div.append(article)
    
    return div
    
    
# ! .chronico script builder function dictionary
# ! filepath String -> etree
builder_dict = {"HEAD~": build_content_head, 
                "DESC~": build_content_desc,
                "CONTENT~": build_content_main,
                "P~": build_content_p,
                "A~": build_content_a,
                "GAMECARD~": build_content_gamecard,
                "VID~": build_content_vid,
                "TUTORWIDGET~": build_content_tutorwidget,
                "PROJECTWIDGET~": build_content_projectwidget,
                "MAINWIDGET~": build_content_mainwidget}
