import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text(docx_file, output_file):
    with zipfile.ZipFile(docx_file) as docx:
        content = docx.read('word/document.xml')
        tree = ET.fromstring(content)
        # XML namespace for Word
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for p in tree.iterfind('.//w:p', ns):
            texts = [node.text for node in p.iterfind('.//w:t', ns) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(paragraphs))

if __name__ == "__main__":
    extract_text(sys.argv[1], sys.argv[2])
