from lxml import etree
from page_builder import homepath
 
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
    
    # build pre-content text for current node
    for i in range(1, inner_start):
        text_content += lines[i]
    text_content = text_content.replace('\t', '')
    
    # build return_etree using chronico script function
    return_etree = chronico_script[script_key](filepath, text_content)
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
# !! returns an etree containing containing the main article header given header text
def build_content_head(filepath, text_content):
    # h1
    h1 = etree.Element("h1")
    h1.set("class", "page-head")
    h1.text = text_content
    return h1
    
# !! build_content_desc : filepath String -> etree
# !! returns an etree containing the main article description given desc text
def build_content_desc(filepath, text_content):
    # desc
    desc = etree.Element("p")
    desc.set("class", "page-desc")
    desc.text = text_content
    return desc

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
    a.set("class", "game-card")
    a.set("href", homepath(filepath) + gamepath)
    
    ## img
    img = etree.SubElement(a, "img")
    img.set("class", "game-icon")
    img.set("src", homepath(filepath) + imgpath)
    
    ## p 
    p1 = etree.SubElement(a, "p")
    
    ### span
    p1_span = etree.SubElement(p1, "span")
    p1_span.set("class", "game-title")
    p1_span.text = title
    p1_span.tail = desc
    
    ## p 
    p2 = etree.SubElement(a, "p")
    p2.text = instructions
    
    return a
    
# ! .chronico script builder function dictionary
chronico_script = {"HEAD~": build_content_head, 
                   "DESC~": build_content_desc,
                   "CONTENT~": build_content_main,
                   "P~": build_content_p,
                   "A~": build_content_a,
                   "GAMECARD~": build_content_gamecard}