import page_builder as pb
from lxml import etree
desc = """Projects, games, and tutorials created by Chronico are free to all
          for learning and entertainment purposes."""
          
if __name__ == "__main__":
    f = open("core/index.chronico")
    text = f.read()
    lines = pb.split_script(text)
    elements = pb.multi_parse(lines)
    main_article = etree.Element('article')
    for element in elements:
        main_article.append(element)
        
    html_tree = pb.build_page("index.html", main_article)
    
    html_doc = etree.tostring(html_tree, method="html", pretty_print=True)
    print(html_doc)
    
    out_file = open("index.html", "wb")
    out_file.write(html_doc)
    out_file.close()